import webhook from "./webhook";

export default function handler(req, res) {
  res.json(webhook.ranking?.sort((a, b) => b.total - a.total) || []);
}
