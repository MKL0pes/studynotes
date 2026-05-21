# studynotes - Low Code / No Code / Vibecode

## Desafio Escolhido
Desenvolver uma aplicação de **organização de estudos** que permita:
- Cadastro de disciplinas e notas.
- Automação de lembretes de revisão.
- Integração leve com IA para sugerir cronogramas personalizados.

Este desafio foi inspirado no repositório de referência `studynotes`, mas adaptado ao paradigma Low Code / No Code / Vibecode.

---

## Protótipo
- **Plataforma usada:** Bubble (frontend visual) + Make (automação).
- **Fluxo principal:**
  1. Usuário cadastra disciplina e notas.
  2. Workflow automático gera lembretes de revisão.
  3. Vibecode (IA via API) sugere cronograma de estudo com prompts estruturados.
- **Prints/Telas:** disponíveis em `/docs/prototipo.png`.
- **Funcionamento:** Interface simples, inputs para disciplinas/notas, botão “Gerar Cronograma” que chama API de IA e retorna plano visual.

---

## Plataforma Utilizada
- **Bubble:** flexibilidade para criar interface visual e banco de dados sem código.
- **Make:** automação de lembretes e integração com serviços externos.
- **Justificativa:** combinação ideal para prototipagem rápida, integração com IA e workflows híbridos.

---

## Vantagens Identificadas
1. Protótipo rápido – interface criada em poucas horas.  
2. Integração simples – conexão com APIs sem escrever código complexo.  
3. Automação de processos – lembretes e fluxos automáticos para revisão.  

---

## Limitações Encontradas
1. Customização limitada – regras de negócio complexas exigem código manual.  
2. Dependência da plataforma – risco de lock-in tecnológico.  
3. Escalabilidade restrita – não ideal para milhões de acessos simultâneos.  

---

## Reflexão Crítica
As limitações foram contornadas com o uso de **Vibecode**:
- Prompts bem estruturados para gerar código leve e suprir lacunas da plataforma.
- Modularização: separar lógica crítica em APIs externas para reduzir dependência.
- Foco em MVP funcional, aceitando que escalabilidade não é prioridade nesta fase.

---

## Colaboração
Projeto desenvolvido **individualmente** por **Mayck Lopes**.  
Responsável por todas as etapas: configuração da plataforma, integração com IA, documentação e justificativa estratégica.

---



## Próximos Passos
- Melhorar interface com dashboards interativos (Power BI).  
- Evoluir para versão mobile usando Adalo.  
- Explorar RPA para automação mais avançada.  
