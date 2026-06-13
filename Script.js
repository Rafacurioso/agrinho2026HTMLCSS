
        // --- Dark Mode ---
        function toggleTheme() {
            const body = document.body;
            const icon = document.getElementById('theme-icon').querySelector('i');
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                icon.className = 'fa-solid fa-moon';
            } else {
                body.setAttribute('data-theme', 'dark');
                icon.className = 'fa-solid fa-sun';
            }
            if(graficoCO2) graficoCO2.update();
        }

        // --- Sistema de Abas ---
        function switchTab(event, tabId) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        // --- Lógica: Calculadora de Carbono (Gráfico Polar Moderno) ---
        let graficoCO2 = null;
        document.addEventListener("DOMContentLoaded", () => {
            const ctx = document.getElementById('graficoCarbono').getContext('2d');
            graficoCO2 = new Chart(ctx, {
                type: 'polarArea',
                data: { 
                    labels: ['Combustível (Diesel)', 'Pecuária (Metano)'], 
                    datasets: [{ 
                        data: [1, 1], 
                        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'], 
                        borderWidth: 1 
                    }] 
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });
            startQuiz(); // Inicia o Quiz no load da página
        });

        function calcCarbono() {
            const diesel = parseFloat(document.getElementById('inpDiesel').value) || 0;
            const gado = parseFloat(document.getElementById('inpGado').value) || 0;
            
            const emDiesel = diesel * 0.0026;
            const emGado = gado * 2.4;
            const total = emDiesel + emGado;

            document.getElementById('resCarbono').style.display = 'block';
            document.getElementById('outCO2').innerText = total.toFixed(1);
            document.getElementById('outILPF').innerText = (total / 7.5).toFixed(1);

            graficoCO2.data.datasets[0].data = [emDiesel, emGado];
            graficoCO2.update();
        }

        // --- Lógica: Pegada Hídrica ---
        function calcAgua() {
            const cultura = document.getElementById('inpCultura').value;
            const area = parseFloat(document.getElementById('inpAreaAgua').value) || 0;
            const fatores = { 'soja': 40000, 'hortalicas': 25000 };
            const consumo = area * fatores[cultura];
            
            document.getElementById('resAgua').style.display = 'block';
            document.getElementById('outAgua').innerText = consumo.toLocaleString('pt-BR');
        }

        // --- Lógica: Planejador Inteligente (Algoritmo Estruturado) ---
        function gerarPlano() {
            const orcamento = parseFloat(document.getElementById('inpOrcamento').value) || 0;
            const tamanho = parseFloat(document.getElementById('inpTamanho').value) || 0;
            const lista = document.getElementById('listaPlano');
            lista.innerHTML = ''; 

            if (orcamento === 0 || tamanho === 0) {
                lista.innerHTML = '<li>Preencha os dados corretamente.</li>';
                return;
            }

            const recs = [];
            if (orcamento < 5000) {
                recs.push({ title: "Compostagem e Rotação", desc: "Use resíduos orgânicos para adubar a terra e alterne o plantio para não desgastar o solo." });
            } else if (orcamento >= 5000 && orcamento < 20000) {
                recs.push({ title: "Transição para Bioinsumos", desc: "Comece a trocar parte dos adubos químicos por soluções biológicas mais sustentáveis." });
                if(tamanho <= 15) recs.push({ title: "Irrigação por Gotejamento", desc: "Sistema altamente eficiente que foca na raiz da planta." });
            } else {
                recs.push({ title: "Sistema ILPF", desc: "Plante árvores junto com a lavoura para sequestrar o carbono emitido." });
                recs.push({ title: "Energia Solar (Painéis)", desc: "Gere sua própria energia para bombas de água e infraestrutura local." });
            }

            recs.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<h4 style="color: var(--warning-orange);">${item.title}</h4><p style="font-size: 0.9rem; opacity: 0.8;">${item.desc}</p>`;
                lista.appendChild(li);
            });
        }

        // --- Lógica: Quiz ---
        const questions = [
            { q: "Qual artigo da Constituição Federal garante o direito ao meio ambiente equilibrado?", options: ["Art. 5º", "Art. 225", "Art. 144"], ans: 1 },
            { q: "O que o gado libera durante o processo de digestão que afeta a atmosfera?", options: ["Gás Metano (CH4)", "Oxigênio (O2)", "Hélio (He)"], ans: 0 },
            { q: "Como a tecnologia ILPF ajuda o meio ambiente?", options: ["Usa robôs na colheita", "As árvores plantadas absorvem o CO2", "Exclui a necessidade de água"], ans: 1 }
        ];

        let currentQ = 0; let score = 0;

        function startQuiz() {
            currentQ = 0; score = 0;
            document.getElementById('scoreText').style.display = 'none';
            document.getElementById('restartBtn').style.display = 'none';
            document.getElementById('optionsBox').style.display = 'grid';
            showQuestion();
        }

        function showQuestion() {
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('questionNumber').innerText = `Questão ${currentQ + 1} de ${questions.length}`;
            document.getElementById('questionText').innerText = questions[currentQ].q;
            
            const box = document.getElementById('optionsBox');
            box.innerHTML = '';
            
            questions[currentQ].options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.innerText = opt;
                btn.onclick = () => checkAns(idx, btn);
                box.appendChild(btn);
            });
        }

        function checkAns(idx, btn) {
            const btns = document.getElementById('optionsBox').querySelectorAll('button');
            btns.forEach(b => b.disabled = true);
            
            if (idx === questions[currentQ].ans) {
                btn.classList.add('correct'); score++;
            } else {
                btn.classList.add('wrong');
                btns[questions[currentQ].ans].classList.add('correct');
            }
            document.getElementById('nextBtn').style.display = 'inline-flex';
        }

        function nextQuestion() {
            currentQ++;
            if (currentQ < questions.length) showQuestion();
            else {
                document.getElementById('questionNumber').innerText = "Concluído!";
                document.getElementById('questionText').innerText = "Resultado Final";
                document.getElementById('optionsBox').style.display = 'none';
                document.getElementById('nextBtn').style.display = 'none';
                document.getElementById('scoreText').style.display = 'block';
                document.getElementById('scoreText').innerText = `Você acertou ${score} de ${questions.length}!`;
                document.getElementById('restartBtn').style.display = 'inline-flex';
            }
        }
