import fetch from "node-fetch";

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Checa o header do token da CentralCart
  const tokenHeader = req.headers["x-centralcart-hash"];
  const token = Buffer.from(tokenHeader, "base64").toString("utf8");

  if (token !== process.env.CENTRALCART_TOKEN) {
    return res.status(401).json({ error: "Token inválido" });
  }

  // Dados do webhook
  const webhookData = req.body;

  console.log("Webhook recebido:", webhookData);

  // Se houver internal_id do pedido, consulta o endpoint da CentralCart
  try {
    const response = await fetch(
      `https://api.centralcart.com.br/v1/app/affiliates/get`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CENTRALCART_TOKEN}`,
        },
      }
    );

    const affiliates = await response.json();

    console.log("Afiliados cadastrados:", affiliates);

    // Aqui você pode atualizar um arquivo JSON público ou banco de dados com os rankings
    // Ex: salvar vendas em "public/ranking.json" ou banco de dados
  } catch (error) {
    console.error("Erro ao consultar afiliados:", error);
    return res.status(500).json({ error: "Erro no servidor" });
  }

  return res.status(200).json({ ok: true });
}
