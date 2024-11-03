import { createSignal } from 'solid-js';
import './stilovi.css';

export default function SalaryCalculator() {
  const [amount, setAmount] = createSignal(1000);
  const [taxRate, setTaxRate] = createSignal(.10);
  const [children, setChildren] = createSignal(0);
  const [isDisabled, setIsDisabled] = createSignal(false);
  const [netto, setNetto] = createSignal(null);

  function submit(event) {
    event.preventDefault();
    const nettoAmount = calculateNetto();
    setNetto(nettoAmount);
  }

  function calculateNetto() {
    const bruto = parseFloat(amount());
    if (isNaN(bruto) || bruto <= 0) return "Unesite valjan iznos";

    // osobni odbitak (osnovni odbitak + odbitak za djecu i invalidnost)
    const osnovniOdbitak = 560.00; // ssnovni odbitak u EUR
    const odbitakZaDjecu = 280.00 * children(); // odbitak po djetetu prema tablici
    const invalidskiOdbitak = isDisabled() ? 560.00 : 0; // odbitak za 100% invalidnost

    // ikupan osobni odbitak
    const ukupniOsobniOdbitak = osnovniOdbitak + odbitakZaDjecu + invalidskiOdbitak;

    // porezna osnovica s osobnim odbitkom
    const poreznaOsnovica = Math.max(bruto - ukupniOsobniOdbitak, 0);

    // porez na dohodak prema odabranoj stopi
    const prag = 4200;
    let porezNaDohodak;
    if (poreznaOsnovica <= prag) {
      porezNaDohodak = poreznaOsnovica * 0.20;
    } else {
      porezNaDohodak = prag * 0.20 + (poreznaOsnovica - prag) * 0.30;
    }

    // prirez prema odabranoj stopi
    const prirez = porezNaDohodak * taxRate();

    // Neto plaća
    const netto = bruto - porezNaDohodak - prirez;
    return netto.toFixed(2);
  }

  return (
    <div>
      <h1>Kalkulator za izračun plaće</h1>
      <form onSubmit={submit}>
        <div>
          <label>Iznos (bruto):</label>
          <input
            type="number"
             // min="0"
            value={amount()}
            onInput={(event) => setAmount(parseFloat(event.target.value))}
          />
        </div>
        <div>
          <label>Stopa poreza:</label>
          <select
            value={taxRate()}
            onInput={(event) => setTaxRate(parseFloat(event.target.value))}
          >
            <option value="0.10">10%</option>
            <option value="0.20">20%</option>
            <option value="0.30">30%</option>
          </select>
        </div>
        <div>
          <label>Broj djece:</label>
          <input
            type="number"
            min="0"
            value={children()}
            onInput={(event) => setChildren(parseInt(event.target.value))}
          />
        </div>
        <div>
          <label>Invalidnost:</label><br /><br />
          <input
            type="checkbox"
            checked={isDisabled()}
            onChange={(event) => setIsDisabled(event.target.checked)}
          />{' '}
          100% invalidnost
        </div>
        <button type="submit">Izračunaj Netto</button>
      </form>
      {netto() && <h2>Netto iznos: {netto()} EUR</h2>}
    </div>
  );
}