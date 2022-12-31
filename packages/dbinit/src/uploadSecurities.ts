import { AddSecurityDTO } from "@csfin/core";
import fs from "fs";
import { SecurityServiceClient } from "./clients";
import { Metadata } from "./types";

/** Converts a metadata instance into the appropriate DTO. */
const meta2dto = (meta: Metadata) => {
  const { isin, nsin, name, "short-name": shortName, type } = meta;

  const dto = new AddSecurityDTO();
  dto.isin = isin;
  dto.nsin = nsin;
  dto.name = name;
  dto.shortName = shortName;
  dto.type = type;

  return dto;
};

/** Processes the JSON data read from the file. */
const processJSON = (jsonData: string) => {
  const client = new SecurityServiceClient();
  const repository = JSON.parse(jsonData) as Metadata[];

  repository.map(meta2dto).forEach((dto) => {
    client.addOne(dto).catch(() => {
      console.error(`Could not add security with ISIN ${dto.isin}`);
    });
  });
};

/** main() -- IIFE */
(() => {
  const cliArgs = process.argv.slice(2);

  if (cliArgs.length < 1) {
    console.error("Please specify the metadata JSON file as a CLI argument");
    process.exit(255);
  }

  const jsonFile = cliArgs[0];

  try {
    const jsonData = fs.readFileSync(jsonFile, "utf8");
    processJSON(jsonData);
  } catch (error) {
    console.error("Could not open the specified file: ", jsonFile);
    process.exit(254);
  }
})();
