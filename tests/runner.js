const suites = [];
let current = null;

export function describe(name, body) {
  current = { name, tests: [] };
  suites.push(current);
  body();
  current = null;
}

export function it(name, body) {
  current.tests.push({ name, body });
}

function stringify(value) {
  return typeof value === "string" ? `"${value}"` : JSON.stringify(value);
}

export function expect(received) {
  return {
    toBe(expected) {
      if (!Object.is(received, expected)) {
        throw new Error(`attendu ${stringify(expected)}, reçu ${stringify(received)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(received) !== JSON.stringify(expected)) {
        throw new Error(`attendu ${stringify(expected)}, reçu ${stringify(received)}`);
      }
    },
    toBeTruthy() {
      if (!received) throw new Error(`attendu une valeur vraie, reçu ${stringify(received)}`);
    },
    toBeFalsy() {
      if (received) throw new Error(`attendu une valeur fausse, reçu ${stringify(received)}`);
    },
    toContain(expected) {
      if (!String(received).includes(expected)) {
        throw new Error(`${stringify(received)} ne contient pas ${stringify(expected)}`);
      }
    },
    toThrow() {
      let thrown = false;
      try {
        received();
      } catch {
        thrown = true;
      }
      if (!thrown) throw new Error("aucune exception levée");
    },
  };
}

function line(status, label, detail) {
  const element = document.createElement("li");
  element.className = `result result--${status}`;
  element.textContent = detail ? `${label} — ${detail}` : label;
  return element;
}

export async function run(container) {
  let passed = 0;
  let failed = 0;

  for (const suite of suites) {
    const section = document.createElement("section");
    const title = document.createElement("h2");
    title.textContent = suite.name;
    const list = document.createElement("ul");

    for (const test of suite.tests) {
      try {
        await test.body();
        passed++;
        list.appendChild(line("pass", `✓ ${test.name}`));
      } catch (error) {
        failed++;
        list.appendChild(line("fail", `✗ ${test.name}`, error.message));
      }
    }

    section.append(title, list);
    container.appendChild(section);
  }

  const summary = document.createElement("p");
  summary.className = failed === 0 ? "summary summary--pass" : "summary summary--fail";
  summary.textContent = `${passed} test(s) réussi(s), ${failed} en échec.`;
  container.prepend(summary);
}
