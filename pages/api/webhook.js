import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const tokenHeader = req.headers["x-centralcart-hash"];
  const token = Buffer.from(tokenHeader, "base64").toString("utf8");

  if (token !== process.env.CENTRALCART_TOKEN) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const webhookData = req.body;
  console.log("Webhook recebido:", webhookData);

  // Aqui você atualiza o ranking.json
  const rankingFile = path.resolve("./public/ranking.json");

  let ranking = [];
  try {
    ranking = JSON.parse(fs.readFileSync(rankingFile, "utf8"));
  } catch (err) {
    console.log("Arquivo ranking.json não existe ou vazio, criando novo");
  }

  // Procura o afiliado pelo email ou cria novo
  const afiliadoIndex = ranking.findIndex(
    (a) => a.email === webhookData.client_email
  );
  const totalVenda = Number(webhookData.price || 0);

  if (afiliadoIndex >= 0) {
    ranking[afiliadoIndex].sales += 1;
    ranking[afiliadoIndex].total += totalVenda;
  } else {
    ranking.push({
      name: webhookData.client_name || webhookData.client_email,
      email: webhookData.client_email,
      sales: 1,
      total: totalVenda,
    });
  }

  // Ordena por total
  ranking.sort((a, b) => b.total - a.total);

  fs.writeFileSync(rankingFile, JSON.stringify(ranking, null, 2));

  res.status(200).json({ ok: true });
}
