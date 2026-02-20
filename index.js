// --- Navigation ---
function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// --- Charts Implementation (Chart.js) ---
document.addEventListener('DOMContentLoaded', () => {

    // Comparison Chart
    const ctxImp = document.getElementById('improvementChart').getContext('2d');
    if (ctxImp) {
        new Chart(ctxImp, {
            type: 'bar',
            data: {
                labels: ['Кількість Сповіщень', 'False Positives (Хибні)', 'Час на Валідацію (хв)'],
                datasets: [
                    {
                        label: 'Стандартний SCA',
                        data: [100, 85, 120],
                        backgroundColor: '#94a3b8', // Slate-400
                        borderRadius: 4
                    },
                    {
                        label: 'Запропонований Метод',
                        data: [25, 5, 40],
                        backgroundColor: '#14b8a6', // Teal-500
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (items) => items[0].label
                        }
                    }
                }
            }
        });
    }

    // Initial Scenario Load
    setScenario('safe');
});

// --- Interactive Simulation Logic ---

const scenarios = {
    safe: {
        id: 'safe',
        code: `<span class="code-keyword">import</span> { <span class="code-function">safeFormat</span> } <span class="code-keyword">from</span> <span class="code-string">'legacy-lib'</span>;
<span class="code-comment">// СЦЕНАРІЙ A: Безпечне використання</span>
<span class="code-comment">// Бібліотека 'legacy-lib' містить вразливість у функції 'dangerousEval',</span>
<span class="code-comment">// але ми використовуємо лише 'safeFormat'.</span>

<span class="code-keyword">const</span> <span class="code-variable">date</span> = <span class="code-keyword">new</span> Date();
console.<span class="code-function">log</span>(<span class="code-function">safeFormat</span>(<span class="code-variable">date</span>));

<span class="code-comment">// Очікуваний результат: BUILD SUCCESS (Вразливість недосяжна)</span>`,
        result: 'success'
    },
    vuln: {
        id: 'vuln',
        code: `<span class="code-keyword">import</span> { <span class="code-function">dangerousEval</span> } <span class="code-keyword">from</span> <span class="code-string">'legacy-lib'</span>;

<span class="code-comment">// СЦЕНАРІЙ B: Експлуатація</span>
<span class="code-comment">// Код напряму імпортує та викликає вразливу функцію.</span>

<span class="code-keyword">const</span> <span class="code-variable">userInput</span> = <span class="code-string">"alert('hacked')"</span>;
<span class="code-function">dangerousEval</span>(<span class="code-variable">userInput</span>);

<span class="code-comment">// Очікуваний результат: BUILD FAILED (Знайдено шлях експлуатації)</span>`,
        result: 'fail'
    },
    unused: {
        id: 'unused',
        code: `<span class="code-keyword">import</span> * <span class="code-keyword">as</span> <span class="code-variable">lib</span> <span class="code-keyword">from</span> <span class="code-string">'legacy-lib'</span>;

<span class="code-comment">// СЦЕНАРІЙ C: Мертвий Код</span>
<span class="code-comment">// Імпорт присутній, але функціонал не викликається.</span>

console.<span class="code-function">log</span>(<span class="code-string">"Hello World"</span>);

<span class="code-comment">// Очікуваний результат: BUILD SUCCESS (Tree Shaking видалить імпорт)</span>`,
        result: 'success'
    }
};

let currentScenario = 'safe';
let isRunning = false;

function setScenario(id) {
    if (isRunning) return;
    currentScenario = id;

    // Update UI
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('border-teal-500', 'border-red-500', 'border-blue-500', 'ring-2');
        btn.classList.add('border-slate-600');
    });

    const activeBtn = document.getElementById(`btn-${id}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-slate-600');
        if (id === 'safe') activeBtn.classList.add('border-teal-500', 'ring-2', 'ring-teal-500/50');
        if (id === 'vuln') activeBtn.classList.add('border-red-500', 'ring-2', 'ring-red-500/50');
        if (id === 'unused') activeBtn.classList.add('border-blue-500', 'ring-2', 'ring-blue-500/50');
    }

    const codeDisplay = document.getElementById('code-display');
    if (codeDisplay) {
        codeDisplay.innerHTML = scenarios[id].code;
    }

    const termOutput = document.getElementById('terminal-output');
    if (termOutput) {
        termOutput.innerHTML = `<div class="text-slate-600">> Ready to build...</div>`;
    }

    const termStatus = document.getElementById('term-status');
    if (termStatus) {
        termStatus.innerText = 'Idle';
        termStatus.className = 'text-slate-500';
    }
}

async function runBuild() {
    if (isRunning) return;
    isRunning = true;

    const btn = document.getElementById('run-btn');
    if (btn) {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    const termStatus = document.getElementById('term-status');
    if (termStatus) {
        termStatus.innerText = 'Running...';
        termStatus.className = 'text-yellow-400 animate-pulse';
    }

    const term = document.getElementById('terminal-output');
    if (term) {
        term.innerHTML = '';
        const logs = [
            { text: '> npm run build', delay: 200, color: 'text-white' },
            { text: '> [Webpack] Starting build...', delay: 500, color: 'text-slate-400' },
            { text: '> [SCA] Found dependency "legacy-lib@1.0.0"', delay: 800, color: 'text-yellow-300' },
            { text: '> [SCA] CVE-2025-XXXX DETECTED in "legacy-lib"', delay: 1000, color: 'text-red-400 font-bold' },
            { text: '> [VulnValidator] Initiating Reachability Analysis...', delay: 1500, color: 'text-teal-400' },
            { text: '> [Parser] Generating AST...', delay: 2000, color: 'text-slate-400' },
            { text: '> [Graph] Tracing call paths...', delay: 2500, color: 'text-slate-400' }
        ];

        // Run common logs
        for (let log of logs) {
            await appendLog(term, log.text, log.color, log.delay);
        }

        // Scenario specific result
        if (currentScenario === 'safe') {
            await appendLog(term, '> [Analysis] Symbol "dangerousEval" is NOT reachable.', 'text-green-400', 3000);
            await appendLog(term, '> [Decision] Suppressing CVE Alert (False Positive).', 'text-green-400', 3200);
            await appendLog(term, '> BUILD SUCCESSFUL', 'text-green-500 font-bold bg-green-900/20 p-1 mt-2', 3500);
            if (termStatus) {
                termStatus.innerText = 'Success';
                termStatus.className = 'text-green-500 font-bold';
            }
        } else if (currentScenario === 'vuln') {
            await appendLog(term, '> [Analysis] Symbol "dangerousEval" is REACHABLE at src/index.js:8', 'text-red-500', 3000);
            await appendLog(term, '> [Decision] Exploit path confirmed.', 'text-red-500', 3200);
            await appendLog(term, '> BUILD FAILED', 'text-red-500 font-bold bg-red-900/20 p-1 mt-2', 3500);
            if (termStatus) {
                termStatus.innerText = 'Failed';
                termStatus.className = 'text-red-500 font-bold';
            }
        } else {
            await appendLog(term, '> [Analysis] Imported module is unused.', 'text-blue-400', 3000);
            await appendLog(term, '> [Info] Tree-shaking will remove this dependency.', 'text-slate-400', 3200);
            await appendLog(term, '> BUILD SUCCESSFUL', 'text-green-500 font-bold bg-green-900/20 p-1 mt-2', 3500);
            if (termStatus) {
                termStatus.innerText = 'Success';
                termStatus.className = 'text-green-500 font-bold';
            }
        }
    }

    isRunning = false;
    if (btn) {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function appendLog(container, text, classes, timestamp) {
    return new Promise(resolve => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = `console-line ${classes}`;
            div.innerHTML = text;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            resolve();
        }, 300); // Fixed delay for better simulation feeling
    });
}