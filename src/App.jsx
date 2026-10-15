
import { useState, useEffect } from "react";
import "./App.css";

const initialMeals = [
  { time: "08:00", name: "Café da manhã", description: "Ovos mexidos, pão integral e banana", calories: 380, icon: "🍳" },
  { time: "12:30", name: "Almoço", description: "Arroz, feijão, frango e salada", calories: 620, icon: "🥗" },
  { time: "16:00", name: "Lanche da tarde", description: "Iogurte natural com aveia", calories: 210, icon: "🥣" },
];

const initialStock = ["Arroz", "Ovos", "Tomate", "Frango", "Banana", "Aveia"];

function App() {
  const [activePage, setActivePage] = useState("Início");
  const [meals, setMeals] = useState(initialMeals);
  const [stock, setStock] = useState(initialStock);
  const [showMealForm, setShowMealForm] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");

  const [apiStatus, setApiStatus] = useState("Verificando conexão...");

  useEffect(() => {
  fetch("http://localhost:3000/")
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error("Falha na API");
      }

      return resposta.json();
    })
    .then((dados) => {
      setApiStatus(dados.mensagem);
    })
    .catch(() => {
      setApiStatus("API desconectada");
    });
}, []);


  const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);
  const calorieGoal = 2000;
  const progress = Math.min((totalCalories / calorieGoal) * 100, 100);

  function addMeal(event) {
    event.preventDefault();

    if (!mealName.trim()) return;

    setMeals([
      ...meals,
      {
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        name: mealName,
        description: mealDescription || "Refeição registrada",
        calories: 0,
        icon: "🍽️",
      },
    ]);

    setMealName("");
    setMealDescription("");
    setShowMealForm(false);
    setActivePage("Refeições");
  }

  function addIngredient() {
    const ingredient = window.prompt("Qual ingrediente deseja adicionar?");

    if (ingredient && ingredient.trim()) {
      setStock([...stock, ingredient.trim()]);
    }
  }

  const navItems = [
    { name: "Início", icon: "⌂" },
    { name: "Refeições", icon: "🍽" },
    { name: "Meu estoque", icon: "▦" },
    { name: "Progresso", icon: "↗" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✳</div>
          <div>
            <h1>Diet<span>.IA</span></h1>
            <p>Seu cuidado diário</p>
          </div>
        </div>

        <div className="menu-label">MENU PRINCIPAL</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Meu estoque" && (
                <span className="nav-count">{stock.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-tip">
          <div className="tip-icon">🌱</div>
          <h3>Pequenos passos, grandes mudanças.</h3>
          <p>Cuide de você no seu ritmo, um dia de cada vez.</p>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">U</div>
          <div>
            <strong>Meu perfil</strong>
            <span>Minha jornada</span>
          </div>
          <span className="footer-dots">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Diet.IA <span>/</span> {activePage}</div>

          <div className="topbar-right">
            <span className="today-label">
              Seu espaço de bem-estar
            </span>

            <span className="api-status">
              {apiStatus}
            </span>

            <div className="top-avatar">U</div>
          </div>

        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">SEU RESUMO DIÁRIO</p>
              <h2>
                {activePage === "Início" ? "Olá! Vamos cuidar de você?" : activePage}
              </h2>
              <p className="subtitle">
                {activePage === "Início"
                  ? "Acompanhe sua alimentação e seus hábitos de hoje."
                  : `Acompanhe suas informações em ${activePage.toLowerCase()}.`}
              </p>
            </div>
            <button className="primary-button" onClick={() => setShowMealForm(true)}>
              <span>＋</span> Registrar refeição
            </button>
          </section>

          {activePage === "Início" && (
            <>
              <section className="summary-grid">
                <article className="summary-card calories-card">
                  <div className="card-topline">
                    <span className="summary-icon orange">♨</span>
                    <span className="soft-tag">Hoje</span>
                  </div>
                  <p className="metric-label">Calorias registradas</p>
                  <div className="metric-value">{totalCalories.toLocaleString("pt-BR")} <span>kcal</span></div>
                  <div className="progress-track">
                    <div className="progress-fill orange-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="metric-note">Meta demonstrativa: {calorieGoal.toLocaleString("pt-BR")} kcal</p>
                </article>

                <article className="summary-card">
                  <div className="card-topline">
                    <span className="summary-icon green">✓</span>
                    <span className="soft-tag green-tag">Hoje</span>
                  </div>
                  <p className="metric-label">Refeições registradas</p>
                  <div className="metric-value">{meals.length} <span>refeições</span></div>
                  <p className="metric-note">Continue registrando sua alimentação.</p>
                </article>

                <article className="summary-card">
                  <div className="card-topline">
                    <span className="summary-icon purple">▦</span>
                    <span className="soft-tag">Disponíveis</span>
                  </div>
                  <p className="metric-label">Ingredientes no estoque</p>
                  <div className="metric-value">{stock.length} <span>itens</span></div>
                  <p className="metric-note">Use o que você já tem em casa.</p>
                </article>
              </section>

              <section className="content-grid">
                <article className="panel meals-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Suas refeições</h3>
                      <p>O que você registrou hoje</p>
                    </div>
                    <button className="text-button" onClick={() => setActivePage("Refeições")}>
                      Ver todas <span>→</span>
                    </button>
                  </div>

                  <div className="meal-list">
                    {meals.slice(0, 4).map((meal, index) => (
                      <div className="meal-row" key={`${meal.name}-${index}`}>
                        <div className="meal-emoji">{meal.icon}</div>
                        <div className="meal-info">
                          <strong>{meal.name}</strong>
                          <p>{meal.description}</p>
                        </div>
                        <div className="meal-data">
                          <strong>{meal.calories} kcal</strong>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="outline-button full-button" onClick={() => setShowMealForm(true)}>
                    ＋ Adicionar refeição
                  </button>
                </article>

                <article className="panel suggestion-panel">
                  <div className="ai-label"><span>✳</span> SUGESTÃO DO DIET.IA</div>
                  <div className="suggestion-illustration">🥑</div>
                  <h3>Que tal uma refeição equilibrada?</h3>
                  <p>Você pode combinar ingredientes que já tem em casa para pensar em uma próxima refeição.</p>
                  <div className="ingredient-chips">
                    {stock.slice(0, 3).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <button className="suggestion-button" onClick={() => setActivePage("Meu estoque")}>
                    Explorar meu estoque <span>→</span>
                  </button>
                  <p className="demo-note">Sugestão ilustrativa. A IA ainda não está conectada.</p>
                </article>
              </section>

              <section className="panel stock-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Meu estoque de ingredientes</h3>
                    <p>Ingredientes disponíveis para suas refeições</p>
                  </div>
                  <button className="text-button" onClick={() => setActivePage("Meu estoque")}>
                    Ver estoque <span>→</span>
                  </button>
                </div>
                <div className="stock-chips">
                  {stock.slice(0, 6).map((item, index) => (
                    <div className="stock-chip" key={`${item}-${index}`}>
                      <span>{["🌾", "🥚", "🍅", "🍗", "🍌", "🥣"][index % 6]}</span>
                      {item}
                    </div>
                  ))}
                  <button className="add-stock-chip" onClick={addIngredient}>＋ Adicionar</button>
                </div>
              </section>
            </>
          )}

          {activePage === "Refeições" && (
            <section className="panel page-panel">
              <div className="panel-heading">
                <div><h3>Histórico de refeições</h3><p>Seus registros demonstrativos</p></div>
                <button className="primary-button" onClick={() => setShowMealForm(true)}>＋ Registrar</button>
              </div>
              {meals.map((meal, index) => (
                <div className="meal-row" key={`${meal.name}-${index}`}>
                  <div className="meal-emoji">{meal.icon}</div>
                  <div className="meal-info"><strong>{meal.name}</strong><p>{meal.description}</p></div>
                  <div className="meal-data"><strong>{meal.calories} kcal</strong><span>{meal.time}</span></div>
                </div>
              ))}
              <p className="demo-note">Os alimentos e valores iniciais são exemplos, não dados nutricionais personalizados.</p>
            </section>
          )}

          {activePage === "Meu estoque" && (
            <section className="panel page-panel">
              <div className="panel-heading">
                <div><h3>Ingredientes disponíveis</h3><p>Gerencie os itens que você tem em casa</p></div>
                <button className="primary-button" onClick={addIngredient}>＋ Adicionar ingrediente</button>
              </div>
              <div className="stock-grid">
                {stock.map((item, index) => (
                  <div className="stock-item" key={`${item}-${index}`}>
                    <span className="stock-item-emoji">{["🌾", "🥚", "🍅", "🍗", "🍌", "🥣"][index % 6]}</span>
                    <strong>{item}</strong>
                    <button title={`Remover ${item}`} onClick={() => setStock(stock.filter((_, i) => i !== index))}>Remover</button>
                  </div>
                ))}
              </div>
              {stock.length === 0 && <p>Seu estoque está vazio. Adicione um ingrediente para começar.</p>}
            </section>
          )}

          {activePage === "Progresso" && (
            <section className="panel page-panel">
              <h3>Seu acompanhamento</h3>
              <p className="subtitle">Resumo dos registros desta sessão.</p>
              <div className="progress-detail">
                <div className="progress-detail-top"><strong>Calorias registradas</strong><span>{totalCalories} / {calorieGoal} kcal</span></div>
                <div className="progress-track large-track"><div className="progress-fill orange-fill" style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="progress-detail">
                <div className="progress-detail-top"><strong>Refeições registradas</strong><span>{meals.length}</span></div>
                <p>Registre suas refeições para manter seu histórico atualizado.</p>
              </div>
              <p className="demo-note">Este painel é demonstrativo. Metas e estimativas nutricionais devem ser validadas antes do uso real.</p>
            </section>
          )}

          <footer className="page-footer">
            <span>Diet.IA · Seu cuidado, um passo de cada vez.</span>
            <span>Protótipo demonstrativo</span>
          </footer>
        </div>
      </main>

      {showMealForm && (
        <div className="modal-backdrop" onClick={() => setShowMealForm(false)}>
          <form className="meal-modal" onSubmit={addMeal} onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><p className="eyebrow">SEU DIÁRIO ALIMENTAR</p><h3>Registrar refeição</h3></div>
              <button type="button" className="close-button" onClick={() => setShowMealForm(false)}>×</button>
            </div>
            <label htmlFor="meal-name">Nome da refeição</label>
            <input id="meal-name" value={mealName} onChange={(event) => setMealName(event.target.value)} placeholder="Ex.: Jantar" required />
            <label htmlFor="meal-description">O que você comeu?</label>
            <textarea id="meal-description" value={mealDescription} onChange={(event) => setMealDescription(event.target.value)} placeholder="Descreva os alimentos..." rows="3" />
            <p className="demo-note">O registro será salvo apenas nesta sessão do navegador. Ainda não há banco conectado.</p>
            <button className="primary-button full-button" type="submit">Salvar refeição</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
