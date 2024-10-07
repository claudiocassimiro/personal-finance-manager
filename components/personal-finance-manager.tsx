"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Alocacao = {
  investimentos: number;
  despesasFixas: number;
  lazer: number;
  outros: number;
};

type DadosMensais = {
  salario: number;
  alocacao: Alocacao;
};

export default function PersonalFinanceManagerComponent() {
  const [salario, setSalario] = useState<number>(0);
  const [alocacao, setAlocacao] = useState<Alocacao>({
    investimentos: 25,
    despesasFixas: 50,
    lazer: 15,
    outros: 10,
  });
  const [historico, setHistorico] = useState<Record<string, DadosMensais>>({});
  const [mesSelecionado, setMesSelecionado] = useState<string>("");

  useEffect(() => {
    const dadosArmazenados = localStorage.getItem("dadosFinanceiros");
    if (dadosArmazenados) {
      setHistorico(JSON.parse(dadosArmazenados));
    }
  }, []);

  useEffect(() => {
    if (mesSelecionado && historico[mesSelecionado]) {
      setSalario(historico[mesSelecionado].salario);
      setAlocacao(historico[mesSelecionado].alocacao);
    }
  }, [mesSelecionado, historico]);

  const handleMudancaSalario = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSalario(Number(event.target.value));
  };

  const handleMudancaAlocacao = (categoria: keyof Alocacao, valor: number) => {
    const novaAlocacao = { ...alocacao, [categoria]: valor };
    const total = Object.values(novaAlocacao).reduce(
      (soma, val) => soma + val,
      0
    );

    if (total <= 100) {
      setAlocacao(novaAlocacao);
    }
  };

  const salvarAlocacao = () => {
    const dataAtual = new Date();
    const chaveDoMes = `${dataAtual.getFullYear()}-${String(
      dataAtual.getMonth() + 1
    ).padStart(2, "0")}`;
    const novoHistorico = {
      ...historico,
      [chaveDoMes]: { salario, alocacao },
    };
    setHistorico(novoHistorico);
    localStorage.setItem("dadosFinanceiros", JSON.stringify(novoHistorico));
    setMesSelecionado(chaveDoMes);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <section className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Finanças Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="salario">Salário Mensal</Label>
              <Input
                id="salario"
                type="number"
                value={salario}
                onChange={handleMudancaSalario}
                placeholder="Digite seu salário mensal"
              />
            </div>
            <div className="space-y-2">
              <Label>Alocação</Label>
              {Object.entries(alocacao).map(([categoria, valor]) => (
                <div key={categoria} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="capitalize">
                      {categoria.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span>{valor}%</span>
                  </div>
                  <Slider
                    value={[valor]}
                    onValueChange={(novoValor) =>
                      handleMudancaAlocacao(
                        categoria as keyof Alocacao,
                        novoValor[0]
                      )
                    }
                    max={100}
                    step={1}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formatarMoeda(salario * (valor / 100))}
                  </p>
                </div>
              ))}
            </div>
            <Button onClick={salvarAlocacao}>Salvar Alocação</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(historico).map((mes) => (
                <SelectItem key={mes} value={mes}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {mesSelecionado && historico[mesSelecionado] && (
            <div className="mt-4">
              <p>Salário: {formatarMoeda(historico[mesSelecionado].salario)}</p>
              <div className="mt-2">
                {Object.entries(historico[mesSelecionado].alocacao).map(
                  ([categoria, valor]) => (
                    <p key={categoria} className="capitalize">
                      {categoria.replace(/([A-Z])/g, " $1").trim()}: {valor}% (
                      {formatarMoeda(
                        historico[mesSelecionado].salario * (valor / 100)
                      )}
                      )
                    </p>
                  )
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdos Relevantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Vídeos sobre Investimentos e Renda Extra
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=ysQYlReodII"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      As maiores burrices cometidas pela classe média feat
                      Investidor Sardinha
                    </a>
                    <p className="text-sm text-gray-600">
                      Um bate-papo que explora os erros comuns que a classe
                      média comete em relação a investimentos e finanças
                      pessoais.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=WDla6ttADAA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      REPROGRAME sua mente para a riqueza em 32 minutos
                    </a>
                    <p className="text-sm text-gray-600">
                      Este vídeo apresenta técnicas para mudar a mentalidade em
                      relação ao dinheiro e como isso pode ajudar na construção
                      de riqueza.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://youtu.be/bx-sTOSteRA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Como montar a sua carteira de investimentos
                    </a>
                    <p className="text-sm text-gray-600">
                      Um guia prático para iniciantes sobre como estruturar uma
                      carteira de investimentos eficiente.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://youtu.be/kXzTa6t1fTg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      4 formas de ganhar dinheiro do seu banco
                    </a>
                    <p className="text-sm text-gray-600">
                      Este vídeo explora maneiras práticas de utilizar serviços
                      bancários para gerar renda extra.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://youtu.be/AdxOee_aik4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Como aprender a investir sem fazer curso?
                    </a>
                    <p className="text-sm text-gray-600">
                      Uma abordagem sobre como adquirir conhecimento em
                      investimentos de forma autônoma e prática.
                    </p>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Canais sobre Investimentos</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <a
                      href="https://www.youtube.com/@MePoupe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Me Poupe!
                    </a>
                    <p className="text-sm text-gray-600">
                      Apresentado por Nathália Arcuri, este canal descomplica a
                      vida financeira com muito humor, oferecendo dicas sobre
                      investimentos e economia.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@primorico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      O Primo Rico
                    </a>
                    <p className="text-sm text-gray-600">
                      Thiago Nigro ensina como se tornar o &quot;primo
                      rico&quot; da família, com foco em aposentadoria precoce e
                      investimentos de alta rentabilidade.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/c/EconoMirna"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      EconoMirna
                    </a>
                    <p className="text-sm text-gray-600">
                      Criado por Mirna Borges, o canal oferece conteúdos leves
                      sobre finanças, empreendedorismo e educação financeira
                      para iniciantes.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/c/RafaelSeabra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Rafael Seabra
                    </a>
                    <p className="text-sm text-gray-600">
                      Autor do best-seller &quot;Quero Ficar Rico&quot;, Rafael
                      Seabra compartilha análises e recomendações de
                      investimentos.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/c/ClubeDoValor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Clube do Valor
                    </a>
                    <p className="text-sm text-gray-600">
                      Apresentado por Ramiro Gomes Ferreira, o canal se
                      concentra em análises de carteiras de ativos e previsões
                      sobre ações específicas.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/c/EuQueroInvestir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Eu Quero Investir
                    </a>
                    <p className="text-sm text-gray-600">
                      Canal da corretora EQI, foca em conteúdos educativos sobre
                      o mercado financeiro e histórias inspiradoras de
                      investidores.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/c/InvestidorSardinha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Investidor Sardinha
                    </a>
                    <p className="text-sm text-gray-600">
                      Raul Sena aborda principalmente ações, com dicas de
                      investimentos e análises do mercado financeiro.
                    </p>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
