import request from "supertest";
import app from "../src/index";


describe("Teste básico de rotas", () => {
  it("O caminho / deve retornar status 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, Test!");
  });
});


describe("1 - Criar meio do usuário consultar ativos disponíveis para simulação", () => {
  it("GET /metadata deve retornar os metadados do sistema", async () => {
    const response = await request(app).get("/metadata");
    expect(response.status).toBe(200);
  });

  it("A lista deve conter pelo menos os seguintes campos: codigoAtivo, tipo e etiqueta", async () => {
    const response = await request(app).get("/metadata");

    response.body.forEach((metadata) => {
      expect(metadata).toHaveProperty("codigoAtivo");
      expect(metadata).toHaveProperty("tipo");
      expect(metadata).toHaveProperty("etiqueta");
    });

    expect(response.status).toBe(200);
  });

  it("A lista deve conter 60 ativos (tamanho da planilha ativos.csv)", async () => {
    const response = await request(app).get("/metadata");
    expect(response.body.length).toBeGreaterThanOrEqual(20);
  });
});


describe("2 - Criar endpoint para consulta de rentabilidade de índice dia a dia", () => {
  it("GET /indice/<TICKER> retorna os valores de timestamps, valorFechamento e rentabilidadeDiaria para possibilitar que seja possível desenhar o gráfico;", async () => {
    const response = await request(app).get("/indice/BNDX11");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("timestamps");
    expect(response.body).toHaveProperty("valorFechamento");
    expect(response.body).toHaveProperty("rentabilidadeDiaria");
  });
  it("GET /indice/CDI retorna os valores de timestamps e rentabilidadeDiaria para taxas de renda fixa (CDI);", async () => {
    const response = await request(app).get("/indice/CDI");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("timestamps");
    expect(response.body).toHaveProperty("rentabilidadeDiaria");
  });
  it("Devem existir valores de fechamento e multiplicadores diários para 501 timestamps para arquivos JSON", async () => {
    const response = await request(app).get("/indice/BNDX11");
    expect(response.status).toBe(200);
    expect(response.body.timestamps.length).toBe(501);
    expect(response.body.valorFechamento.length).toBe(501);
    expect(response.body.rentabilidadeDiaria.length).toBe(501);
  });
  it("Devem existir valores de fechamento e multiplicadores diários para 9707 timestamps para o arquivo XLSX", async () => {
    const response = await request(app).get("/indice/CDI");
    expect(response.status).toBe(200);
    expect(response.body.timestamps.length).toBe(9707);
    expect(response.body.rentabilidadeDiaria.length).toBe(9707);
  });

  it("Deve retornar 404 caso o ticker não exista", async () => {
    const response = await request(app).get("/indice/BNDX111");
    expect(response.status).toBe(404);
  });
});

describe("3 - Criar endpoint calculando rentabilidade da carteira dia a dia", () => {
  it("Endpoint /carteira deve recever uma lista de ticker e pesos e deve retornar os indices ponderados, rentabilidade diária, rentabilidade total e rentabilidade percentual \n" +
    "(GET /carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30 )",
    async () => {
      const response = await request(app).get("/carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("tickers");
      expect(response.body).toHaveProperty("pesos");
      expect(response.body).toHaveProperty("indicesPonderados");
      expect(response.body).toHaveProperty("rentabilidadeDiaria");
      expect(response.body).toHaveProperty("rentabilidadeTotal");
      expect(response.body).toHaveProperty("rentabilidadePercentual");
    })
})
describe("4 - Criar filtro de rentabilidade baseado na data inicial e final:", () => {
  it("Endpoint /indice/ALUG11?from=1701867600&to=1711112400 deve retornar 72 valores de timestamp, rentabilidadeDiaria e valorFechamento", async () => {
    const response = await request(app).get("/indice/ALUG11?from=1701867600&to=1711112400");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("timestamps");
    expect(response.body).toHaveProperty("valorFechamento");
    expect(response.body).toHaveProperty("rentabilidadeDiaria");
    expect(response.body.timestamps.length).toBe(72);
    expect(response.body.valorFechamento.length).toBe(72);
    expect(response.body.rentabilidadeDiaria.length).toBe(72);
  })
  it("Endpoint /carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30&from=1701867600&to=1711112400 \n" + 
    "deve retornar 72 valores de rentabilidadeDiaria", async () => {
    const response = await request(app).get("/carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30&from=1701867600&to=1711112400");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("rentabilidadeDiaria");
    expect(response.body.rentabilidadeDiaria.length).toBe(72);
  })
})

describe("5 - Cálcular simulação baseada em composição, datas e valor", () => {
  it("Endpoint /carteira deve retornar os indices ponderados, rentabilidade diária, valor inicial, valor final, rentabilidade total e rentabilidade percentual (GET /carteira/?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30&from=1701867600&to=1711112400&valorInicial=10000 )", async () => {
    const response = await request(app).get("/carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30&from=1701867600&to=1711112400&valorInicial=10000");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tickers");
    expect(response.body).toHaveProperty("pesos");
    expect(response.body).toHaveProperty("indices");
    expect(response.body).toHaveProperty("indicesPonderados");
    expect(response.body).toHaveProperty("rentabilidadeDiaria");
    expect(response.body).toHaveProperty("valorInicial");
    expect(response.body).toHaveProperty("valorFinal");
    expect(response.body).toHaveProperty("rentabilidadeTotal");
    expect(response.body).toHaveProperty("rentabilidadePercentual");
  });
});
