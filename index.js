import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs, read, readFileSync, write } from "fs";

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());

app.use("/account", accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile("car-list.json");
    console.log("API Started!");
  } catch (err) {
    const initialJson = {
      brand: "Teste",
      models: [],
    };
    writeFile("car-list.json", JSON.stringify(initialJson))
      .then(() => {
        console.log("Arquivo criado API Started!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//Função 1
function marcaMaisModelos() {
  const carListData = readFileSync("car-list.json", "utf8");
  const carList = JSON.parse(carListData);

  let marcaMaisModelos = "";
  let maxModelos = 0;

  carList.forEach((brand) => {
    const qtdModelos = brand.models.length;
    if (qtdModelos > maxModelos) {
      maxModelos = qtdModelos;
      marcaMaisModelos = brand.brand;
    } else if (qtdModelos === maxModelos) {
      marcaMaisModelos = [marcaMaisModelos, brand.brand];
    }
  });

  if (Array.isArray(marcaMaisModelos)) {
    return marcaMaisModelos;
  } else {
    return marcaMaisModelos;
  }
}

//Função 2
function marcaMenosModelos() {
  const carListData = readFileSync("car-list.json", "utf8");
  const carList = JSON.parse(carListData);

  let marcaMenosModelos = "";
  let minModelos = Number.MAX_VALUE;

  carList.forEach((brand) => {
    const qtdModelos = brand.models.length;
    if (qtdModelos < minModelos) {
      minModelos = qtdModelos;
      marcaMenosModelos = brand.brand;
    } else if (qtdModelos === minModelos) {
      marcaMenosModelos = [marcaMenosModelos, brand.brand];
    }
  });

  if (Array.isArray(marcaMenosModelos)) {
    return marcaMenosModelos;
  } else {
    return marcaMenosModelos;
  }
}

const marcaMaisModelosRes = marcaMaisModelos();
const marcaMenosModelosRes = marcaMenosModelos();

console.log("MAIS modelos:", marcaMaisModelosRes);
console.log("MENOS modelos:", marcaMenosModelosRes);

//Função 3
function ordenadasMax(x) {
  const carListData = readFileSync("car-list.json", "utf8");
  const carList = JSON.parse(carListData);
  const brandCounts = {};

  carList.forEach((car) => {
    car.models.forEach((models) => {
      const brand = car.brand;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
  });

  const brandCountArray = Object.entries(brandCounts);

  brandCountArray.sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    } else {
      return a[0].localeCompare(b[0]);
    }
  });

  const topBrands = brandCountArray.slice(0, x);

  const ordenadasMax = topBrands.map(([brand, count]) => `${brand} - ${count}`);
  return ordenadasMax;
}

//Função 4
function ordenadasMin(x) {
  const carListData = readFileSync("car-list.json", "utf8");
  const carList = JSON.parse(carListData);
  const brandCounts = {};

  carList.forEach((car) => {
    car.models.forEach((models) => {
      const brand = car.brand;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
  });

  const brandCountArray = Object.entries(brandCounts);

  brandCountArray.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1];
    } else {
      return a[0].localeCompare(b[0]);
    }
  });

  const lowBrands = brandCountArray.slice(0, x);

  const ordenadasMin = lowBrands.map(([brand, count]) => `${brand} - ${count}`);
  return ordenadasMin;
}

const topBrands = ordenadasMax("48");
console.log("Marcas com mais modelos:", topBrands);

const bottomBrands = ordenadasMin("7");
console.log("Marcas com menos modelos:", bottomBrands);

//Função 5
function buscarMarca(targetBrand) {
  const carListData = readFileSync("car-list.json", "utf8");
  const carList = JSON.parse(carListData);

  targetBrand = targetBrand.toLowerCase();

  const brandData = carList.find(
    (car) => car.brand.toLowerCase() === targetBrand
  );
  if (brandData) {
    return brandData.models;
  } else {
    return [];
  }
}

const marca = "Honda";
const models = buscarMarca(marca);
console.log("Modelos da marca:", marca, models);
