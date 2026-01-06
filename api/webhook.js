let ranking = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método inválido" });
  }

  // Verificação do token
  const receivedHash = req.headers["x-centralcart-hash"];
  const myToken = process.env.CENTRALCART_TOKEN;

  if (
    !receivedHash ||
    Buffer.from(receivedHash, "base64").toString() !== myToken
  ) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const { promo_code, price } = req.body;

  if (!promo_code) {
    return res.status(200).json({ ok: true });
  }

  let afiliado = ranking.find((a) => a.name === promo_code);

  if (!afiliado) {
    afiliado = { name: promo_code, sales: 0, total: 0 };
    ranking.push(afiliado);
  }

  afiliado.sales += 1;
  afiliado.total += Number(price);

  res.status(200).json({ ok: true });
}
