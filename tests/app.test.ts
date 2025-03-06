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
  it("Devem existir valores de fechamento e multiplicadores diarios para 501 timestamps (tamanho dos arquivos JSON)", async () => {
    const response = await request(app).get("/indice/BNDX11");
    expect(response.status).toBe(200);
    expect(response.body.timestamps.length).toBe(501);
    expect(response.body.valorFechamento.length).toBe(501);
    expect(response.body.rentabilidadeDiaria.length).toBe(501);
  });
});