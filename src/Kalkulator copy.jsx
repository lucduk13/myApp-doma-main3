import { createSignal } from 'solid-js';
import './stilovi.css';

export default function SalaryCalculator() {  //definira glavnu funkciju komponente SalaryCalculator, koja predstavlja kalkulator plaće.
  const [amount, setAmount] = createSignal(1000); //Stvara reaktivno stanje amount koje čuva bruto iznos plaće s početnom vrijednošću 1000. setAmount je funkcija koja se koristi za ažuriranje vrijednosti amount.
  const [taxRate, setTaxRate] = createSignal(.10); //Stvara stanje taxRate koje čuva stopu prireza, s početnom vrijednošću od 10% (0.10). setTaxRate mijenja ovu vrijednost.
  const [children, setChildren] = createSignal(0); //Stvara stanje children koje čuva broj djece, s početnom vrijednošću 0. setChildren mijenja ovu vrijednost.
  const [isDisabled, setIsDisabled] = createSignal(false); //const [isDisabled, setIsDisabled] = createSignal(false);: Stvara stanje isDisabled koje označava invalidnost korisnika. Početna vrijednost je false (nema invalidnosti).
  const [netto, setNetto] = createSignal(null); //const [netto, setNetto] = createSignal(null);: Stvara stanje netto koje čuva izračunati neto iznos plaće. Početna vrijednost je null.

  function submit(event) {
    event.preventDefault(); // Sprečava zadano ponašanje slanja forme, kako stranica ne bi bila ponovno učitana kada korisnik pritisne "Izračunaj Netto".
    const nettoAmount = calculateNetto(); // Poziva funkciju calculateNetto koja računa neto iznos na temelju unesenih podataka i sprema rezultat u varijablu nettoAmount.
    setNetto(nettoAmount); // Postavlja stanje netto na izračunati neto iznos, što omogućuje prikaz izračuna na stranici.
  }

  function calculateNetto() { //Ova funkcija vrši sve potrebne izračune za neto plaću.
    const bruto = parseFloat(amount()); //Pretvara vrijednost amount u decimalni broj (floating point number).
    if (isNaN(bruto) || bruto <= 0) return "Unesite valjan iznos"; //Provjerava je li bruto broj i je li veći od nule; ako nije, funkcija vraća poruku "Unesite valjan iznos".

    
    const osnovniOdbitak = 560.00; // Definira osnovni osobni odbitak (560 EUR).
    const odbitakZaDjecu = 280.00 * children(); // Množi broj djece s odbitkom po djetetu (280 EUR).
    const invalidskiOdbitak = isDisabled() ? 560.00 : 0; // Ako je isDisabled true, postavlja invalidski odbitak na 560 EUR; u suprotnom na 0 EUR.

    
    const ukupniOsobniOdbitak = osnovniOdbitak + odbitakZaDjecu + invalidskiOdbitak; //Zbroj osnovnog odbitka, odbitka za djecu i invalidskog odbitka.

    
    const poreznaOsnovica = Math.max(bruto - ukupniOsobniOdbitak, 0); //Računa poreznu osnovicu tako da od bruto iznosa oduzme ukupni osobni odbitak. Osigurava da porezna osnovica ne može biti manja od 0 (Math.max).

    
    const prag = 4200; //Definira prag od 4200 EUR, iznad kojeg se primjenjuje viša porezna stopa (30%).
    let porezNaDohodak;
    if (poreznaOsnovica <= prag) {
      porezNaDohodak = poreznaOsnovica * 0.20;
    } else {
      porezNaDohodak = prag * 0.20 + (poreznaOsnovica - prag) * 0.30;
    }
    //Ako je poreznaOsnovica manja ili jednaka pragu, porez se računa s nižom stopom (20%). Ako je veća, primjenjuje se stopa od 20% na prvih 4200 EUR, a zatim 30% na ostatak.

  
    const prirez = porezNaDohodak * taxRate(); //Računa iznos prireza kao postotak (taxRate) od poreza na dohodak (porezNaDohodak).

    
    const netto = bruto - porezNaDohodak - prirez; //Neto plaća se izračunava tako da se od bruto iznosa oduzmu porez na dohodak i prirez.
    return netto.toFixed(2); //Vraća neto iznos kao string s dvije decimale.
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
             // Kreira polje za unos bruto iznosa. Svaka promjena u polju ažurira stanje amount putem setAmount.
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
  ); // Prikazuje izračunatu neto plaću ako postoji vrijednost netto.
}