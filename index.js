import express from "express";
import { promises as fs, read, readFileSync, write } from "fs";

const { readFile, writeFile } = fs;
const app = express();
app.use(express.json());

//Chamada teste
app.get("/teste", (req, res) => {
  res.send(req.method);
});

app.get("/marcas/maisModelos", (req, res) => {
  const marcaMaisModelosRes = marcaMaisModelos();
  res.send(marcaMaisModelosRes);
});

app.get("/marcas/menosModelos", (req, res) => {
  const marcaMenosModelosRes = marcaMenosModelos();
  res.send(marcaMenosModelosRes);
});

app.get("/marcas/listaMaisModelos/:X", (req, res) => {
  const qtd = req.params.X;
  const topBrands = ordenadasMax(qtd);
  res.send(topBrands);
});

app.get("/marcas/listaMenosModelos/:X", (req, res) => {
  const qtd = req.params.X;
  const lowBrands = ordenadasMin(qtd);
  res.send(lowBrands);
});

app.post("/marcas/listaModelos", (req, res) => {
  const marca = req.body;
  const resultado = buscarMarca(marca);
  res.send(resultado);
});

app.listen(3009, async () => {
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

//Busca marca com mais modelos
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

//Busca marca com menos modelos
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

//Busca x marcas com mais modelos e ordena alfabeticamente
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

//Busca x marcas com menos modelos e ordena alfabeticamente
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

//Busca marca parametrizada
function buscarMarca(targetBrand) {
  const carListData = readFileSync("car-list.json", "utf8");
  const carList = JSON.parse(carListData);

  targetBrand = targetBrand.nomeMarca.toLowerCase();

  const brandData = carList.find(
    (car) => car.brand.toLowerCase() === targetBrand
  );
  if (brandData) {
    return brandData.models;
  } else {
    return [];
  }
}
