import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const rankingFile = path.resolve("./public/ranking.json");

  let ranking = [];
  try {
    ranking = JSON.parse(fs.readFileSync(rankingFile, "utf8"));
  } catch (err) {
    console.log("Arquivo ranking.json não existe ou vazio");
  }

  res.status(200).json(ranking);
}
