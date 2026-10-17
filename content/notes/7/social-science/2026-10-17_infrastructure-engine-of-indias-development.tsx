"use client";

import { useState, type ReactNode } from "react";
import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

const colors: NoteColors = {
  light: ["#0369A1", "#B45309", "#15803D", "#BE123C"],
  dark: ["#7DD3FC", "#FCD34D", "#86EFAC", "#FDA4AF"],
};

/* ---------- shared styles and small helpers ---------- */

const BTN_PRIMARY =
  "rounded-lg border border-brand bg-brand px-4 py-1.5 text-sm font-semibold text-page disabled:cursor-not-allowed disabled:opacity-50";
const BTN_SECONDARY =
  "rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50";
const WIDGET = "rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5";

function Th({ children, tone }: { children: ReactNode; tone?: string }) {
  return <th className={`border border-line p-2 text-left ${tone ?? "bg-brand/15 text-brand"}`}>{children}</th>;
}

function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={`border border-line p-2 align-top ${className ?? ""}`}>{children}</td>;
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-line bg-page p-3">
      <p className="text-xs text-mute">{label}</p>
      <p className={`font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

/* ---------- bar chart (used for rail, ports and road widths) ---------- */

interface BarRow {
  label: string;
  value: number;
}

function Bars({
  rows,
  highlight,
  unit,
  decimals,
}: {
  rows: BarRow[];
  highlight: string;
  unit: string;
  decimals: number;
}) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div className="space-y-2" role="list">
      {rows.map((r) => {
        const pct = (r.value / max) * 100;
        const hl = r.label === highlight;
        return (
          <div key={r.label} role="listitem">
            <div className="flex justify-between gap-3 text-xs">
              <span className={hl ? "font-semibold text-brand2" : "text-fg"}>{r.label}</span>
              <span className={hl ? "shrink-0 font-semibold text-brand2" : "shrink-0 text-mute"}>
                {r.value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{" "}
                {unit}
              </span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-tint">
              <div
                style={{ width: `${pct}%` }}
                className={hl ? "h-full rounded-full bg-brand2" : "h-full rounded-full bg-brand/60"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- widget 1: sort the infrastructure ---------- */

type InfraGroup = "transport" | "utilities" | "communication" | "energy" | "social";

const GROUP_ORDER: InfraGroup[] = ["transport", "utilities", "communication", "energy", "social"];

const GROUP_LABEL: Record<InfraGroup, string> = {
  transport: "Transportation",
  utilities: "Utilities",
  communication: "Communication",
  energy: "Energy",
  social: "Social infrastructure",
};

interface SortItem {
  name: string;
  group: InfraGroup;
  why: string;
}

const SORT_ITEMS: SortItem[] = [
  { name: "Expressway", group: "transport", why: "Roads and highways are transportation systems that move people and goods." },
  { name: "Metro rail", group: "transport", why: "Metro trains are part of the transportation network of a city." },
  { name: "Airport", group: "transport", why: "Airports, like seaports and railways, belong to transportation systems." },
  { name: "Water pipeline", group: "utilities", why: "Water supply is a utility, a basic service delivered to homes and factories." },
  { name: "Electricity supply line", group: "utilities", why: "Electricity supply is a utility. The power plant itself may belong to energy infrastructure." },
  { name: "Telecom tower", group: "communication", why: "Towers, cables and satellites make up communication networks." },
  { name: "Optical fibre cable", group: "communication", why: "Fibre cables carry calls and data, so they are communication infrastructure." },
  { name: "Solar park", group: "energy", why: "Solar parks, windmills and oil and gas pipelines are energy infrastructure." },
  { name: "Oil and gas pipeline", group: "energy", why: "Pipelines deliver fuel across long distances, so they count as energy infrastructure." },
  { name: "Windmill", group: "energy", why: "A windmill turns wind into energy, which makes it energy infrastructure." },
  { name: "School", group: "social", why: "Schools build knowledge and skills, which is the job of social infrastructure." },
  { name: "Hospital", group: "social", why: "Hospitals and health centres look after people’s health and well-being." },
  { name: "Fire station", group: "social", why: "Police stations, fire stations and courts keep communities safe, so they are social infrastructure." },
  { name: "Library", group: "social", why: "Libraries, parks and community centres support the well-being of a community." },
];

function ClassifySorter() {
  const [idx, setIdx] = useState<number>(0);
  const [picks, setPicks] = useState<Record<number, InfraGroup>>({});
  const total = SORT_ITEMS.length;
  const score = SORT_ITEMS.filter((it, i) => picks[i] === it.group).length;
  const item = SORT_ITEMS[idx];

  if (idx >= total || !item) {
    return (
      <div className={WIDGET}>
        <p aria-live="polite" className="text-lg font-semibold text-fg">
          You scored {score} out of {total}.
        </p>
        <p className="mt-1 text-sm text-mute">
          {score >= 12
            ? "Excellent. You can tell physical and social infrastructure apart, and you know the four physical groups."
            : score >= 8
            ? "Good effort. Revisit the table in Section 1 and try again."
            : "Read Section 1 once more, focusing on the four physical groups and the list of social infrastructure, then retry."}
        </p>
        <button
          type="button"
          aria-label="Restart the sorting activity"
          onClick={() => {
            setIdx(0);
            setPicks({});
          }}
          className={`${BTN_PRIMARY} mt-3`}
        >
          Try again
        </button>
      </div>
    );
  }

  const picked = picks[idx];
  const answered = picked !== undefined;

  return (
    <div className={WIDGET}>
      <div className="flex items-center justify-between text-xs text-mute">
        <span>
          Item {idx + 1} of {total}
        </span>
        <span>Score so far: {score}</span>
      </div>
      <p className="mt-3 text-center text-xl font-semibold text-fg">{item.name}</p>
      <p className="mt-1 text-center text-sm text-mute">Which kind of infrastructure is this?</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {GROUP_ORDER.map((g) => {
          let cls = BTN_SECONDARY;
          if (answered && g === item.group)
            cls = "rounded-lg border border-brand3 bg-brand3/20 px-3 py-1.5 text-sm font-semibold text-fg";
          else if (answered && g === picked)
            cls = "rounded-lg border border-brand4 bg-brand4/20 px-3 py-1.5 text-sm text-fg";
          return (
            <button
              key={g}
              type="button"
              disabled={answered}
              onClick={() => setPicks((p) => ({ ...p, [idx]: g }))}
              className={`${cls} text-left`}
            >
              {answered && g === item.group ? "✓ " : answered && g === picked ? "✗ " : ""}
              {GROUP_LABEL[g]}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3">
          <p className="text-sm">
            <span className={picked === item.group ? "font-semibold text-ok" : "font-semibold text-accent"}>
              {picked === item.group ? "Correct. " : `Not quite. It belongs under ${GROUP_LABEL[item.group]}. `}
            </span>
            <span className="text-mute">{item.why}</span>
          </p>
          <button
            type="button"
            aria-label={idx === total - 1 ? "See your final score" : "Go to the next item"}
            onClick={() => setIdx((n) => n + 1)}
            className={`${BTN_PRIMARY} mt-3`}
          >
            {idx === total - 1 ? "See my score" : "Next item"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- widget 2: Satish’s tomato chain ---------- */

interface ChainLink {
  id: string;
  label: string;
  stage: string;
  okText: string;
  brokenText: string;
}

const CHAIN: ChainLink[] = [
  {
    id: "water",
    label: "Canals and electric pumps",
    stage: "1. Grow",
    okText: "Water reaches the fields on time, so the plants grow well.",
    brokenText: "The plants do not get enough water and dry up.",
  },
  {
    id: "roads",
    label: "Roads and bridges",
    stage: "2. Transport",
    okText: "Trucks carry the tomatoes to the city quickly and safely.",
    brokenText: "Trucks cannot move fast enough, so the tomatoes rot on the way.",
  },
  {
    id: "cold",
    label: "Cold storage",
    stage: "3. Store",
    okText: "The tomatoes stay fresh until they are sold.",
    brokenText: "Fresh tomatoes spoil quickly because nothing keeps them cool.",
  },
  {
    id: "net",
    label: "Phone and internet",
    stage: "4. Sell",
    okText: "Satish checks market prices and finds the best buyer and the best farming advice.",
    brokenText: "Satish cannot learn the prices or get advice, so he may sell at a poor price.",
  },
];

function ChainSimulator() {
  const [on, setOn] = useState<Record<string, boolean>>({ water: true, roads: true, cold: true, net: true });
  const working = CHAIN.filter((l) => on[l.id]).length;

  let outcome = "";
  if (working === 4) outcome = "The whole chain works: a healthy crop, quick delivery, fresh tomatoes and a fair price. Satish’s hard work pays off.";
  else if (working === 3) outcome = "Just one broken link is enough to lose a good part of the harvest or its value.";
  else if (working === 2) outcome = "Half the chain has failed, so most of the effort is wasted.";
  else outcome = "Almost nothing works. Satish grew tomatoes, but he earns very little from them.";

  return (
    <div className={WIDGET}>
      <p className="text-sm text-mute">
        Switch each piece of infrastructure on or off and watch what happens to Satish’s tomatoes.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CHAIN.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-label={`${l.label}: currently ${on[l.id] ? "on" : "off"}. Press to switch.`}
            aria-pressed={on[l.id]}
            onClick={() => setOn((s) => ({ ...s, [l.id]: !s[l.id] }))}
            className={on[l.id] ? BTN_PRIMARY : BTN_SECONDARY}
          >
            {on[l.id] ? "✓ " : "✗ "}
            {l.label}
          </button>
        ))}
        <button
          type="button"
          aria-label="Switch all infrastructure back on"
          onClick={() => setOn({ water: true, roads: true, cold: true, net: true })}
          className={BTN_SECONDARY}
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHAIN.map((l) => (
          <div
            key={`stage-${l.id}`}
            className={
              on[l.id]
                ? "rounded-xl border border-brand3/50 bg-brand3/10 p-3"
                : "rounded-xl border border-brand4/50 bg-brand4/10 p-3"
            }
          >
            <p className="text-xs font-semibold text-mute">{l.stage}</p>
            <p className={on[l.id] ? "mt-1 text-sm text-fg" : "mt-1 text-sm font-medium text-fg"}>
              <span className={on[l.id] ? "font-bold text-ok" : "font-bold text-accent"}>{on[l.id] ? "✓ " : "✗ "}</span>
              {on[l.id] ? l.okText : l.brokenText}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-tint">
          <div style={{ width: `${(working / 4) * 100}%` }} className="h-full rounded-full bg-brand3" />
        </div>
        <p className="mt-1 text-xs text-mute">Links working: {working} of 4</p>
        <p aria-live="polite" className="mt-2 text-sm font-medium text-fg">
          {outcome}
        </p>
      </div>
    </div>
  );
}

/* ---------- widget 3: rail and port data explorer ---------- */

interface Dataset {
  id: "track" | "electric" | "teu";
  tab: string;
  title: string;
  unit: string;
  decimals: number;
  highlight: string;
  rows: BarRow[];
}

const DATASETS: Dataset[] = [
  {
    id: "track",
    tab: "Railway track length",
    title: "Length of railway tracks, 2024",
    unit: "km",
    decimals: 0,
    highlight: "India",
    rows: [
      { label: "USA", value: 293564 },
      { label: "China", value: 150000 },
      { label: "Russia", value: 85494 },
      { label: "India", value: 69181 },
      { label: "Canada", value: 48000 },
    ],
  },
  {
    id: "electric",
    tab: "Electrified railways",
    title: "Share of the railway network that is electrified, 2024",
    unit: "%",
    decimals: 0,
    highlight: "India",
    rows: [
      { label: "India", value: 97 },
      { label: "China", value: 75 },
      { label: "France", value: 61 },
      { label: "Germany", value: 55 },
      { label: "United Kingdom", value: 38 },
    ],
  },
  {
    id: "teu",
    tab: "Container ports",
    title: "Container traffic of major ports, 2024",
    unit: "million TEU",
    decimals: 2,
    highlight: "Mumbai (India)",
    rows: [
      { label: "Shanghai (China)", value: 51.51 },
      { label: "Singapore", value: 41.12 },
      { label: "Busan (South Korea)", value: 24.4 },
      { label: "Jebel Ali, Dubai (UAE)", value: 15.54 },
      { label: "Port Klang (Malaysia)", value: 14.64 },
      { label: "Rotterdam (Netherlands)", value: 13.82 },
      { label: "Antwerp (Belgium)", value: 13.5 },
      { label: "Los Angeles (USA)", value: 10.3 },
      { label: "Mumbai (India)", value: 7.05 },
    ],
  },
];

function insightFor(d: Dataset): string {
  const sorted = [...d.rows].sort((a, b) => b.value - a.value);
  const at = sorted.findIndex((r) => r.label === d.highlight);
  const mine = sorted[at];
  const first = sorted[0];
  const second = sorted[1];
  const last = sorted[sorted.length - 1];
  if (!mine || !first || !second || !last) return "";
  const rank = at + 1;
  if (d.id === "track") {
    return `India ranks ${rank} of ${sorted.length}. The USA has about ${(first.value / mine.value).toFixed(1)} times India’s track length and China about ${(second.value / mine.value).toFixed(1)} times. Length shows the size of a network, not how busy it is: Indian Railways still carries over 20 million passengers a day.`;
  }
  if (d.id === "electric") {
    return `India ranks ${rank} of ${sorted.length} at ${mine.value}%, which is ${mine.value - second.value} percentage points ahead of ${second.label}. The ${last.label} has electrified only ${last.value}% of its network. High electrification means cleaner trains with no smoke from the engine.`;
  }
  return `Mumbai ranks ${rank} of ${sorted.length} in this list. ${first.label.split(" (")[0]} handled about ${(first.value / mine.value).toFixed(1)} times as many containers as Mumbai. A busy port needs deep water, cranes, rail and road links, and warehouses working together.`;
}

function DataExplorer() {
  const [id, setId] = useState<Dataset["id"]>("track");
  const d = DATASETS.find((x) => x.id === id);
  if (!d) return null;
  return (
    <div className={WIDGET}>
      <div className="flex flex-wrap gap-2">
        {DATASETS.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-label={`Show chart: ${x.title}`}
            aria-pressed={id === x.id}
            onClick={() => setId(x.id)}
            className={id === x.id ? BTN_PRIMARY : BTN_SECONDARY}
          >
            {x.tab}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-fg">{d.title}</p>
      <div className="mt-3">
        <Bars rows={d.rows} highlight={d.highlight} unit={d.unit} decimals={d.decimals} />
      </div>
      <div className="mt-4 rounded-xl border border-brand/30 bg-page p-3">
        <p className="text-xs font-semibold text-brand">What the numbers say</p>
        <p className="mt-1 text-sm text-fg">{insightFor(d)}</p>
      </div>
    </div>
  );
}

/* ---------- widget 4: timelines with a self-test mode ---------- */

interface TLEvent {
  when: string;
  title: string;
  why: string;
}

const TRAIN_EVENTS: TLEvent[] = [
  { when: "1853", title: "First railway in India, from Bombay to Thane", why: "Introduced by the British, mainly to carry raw materials such as cotton and tea to ports." },
  { when: "1895", title: "F-734, a steam locomotive", why: "Steam engines burned coal to make steam. They powered the early railways but were smoky." },
  { when: "1957", title: "WDM-1, the first diesel locomotive", why: "Diesel engines began to replace coal-burning steam engines." },
  { when: "1970", title: "WAM-4, an electric locomotive", why: "Electric engines draw power from overhead wires and give out no smoke themselves." },
  { when: "2019", title: "Vande Bharat", why: "An indigenously developed (made in India) semi-high-speed electric train." },
];

const COMM_EVENTS: TLEvent[] = [
  { when: "200 BCE–1200 CE", title: "Pigeons, runners and horse couriers", why: "A message could travel only as fast as a bird, a runner or a horse." },
  { when: "1605", title: "First newspaper printed, in Germany", why: "Printing let the same news reach many people at once." },
  { when: "1780", title: "Bengal Gazette, India’s first printed newspaper", why: "Printed news arrived in India." },
  { when: "1843", title: "First fax machine, by Alexander Bain", why: "It paved the way for sending images over distance." },
  { when: "1844", title: "Telegraph, with Morse code, by Samuel Morse", why: "Messages travelled as electric signals of dots and dashes along wires." },
  { when: "1876", title: "Telephone, by Alexander Graham Bell", why: "For the first time a voice could be carried along a wire." },
  { when: "1895", title: "J.C. Bose demonstrates wireless transmission in Calcutta", why: "Signals travelled without wires, even through a wall." },
  { when: "1927", title: "Television invented", why: "Moving pictures could be sent over distance." },
  { when: "1930", title: "All India Radio begins broadcasting", why: "In 1947 Shri Shanmukham Chetty broadcast the first Union Budget on AIR." },
  { when: "1970", title: "Personal computers developed", why: "Computing moved from large machines into homes and offices." },
  { when: "1990s", title: "Email and instant messaging", why: "Written messages could cross the world in seconds." },
  { when: "1993", title: "First smartphone developed", why: "A phone, a computer and a camera came together in one pocket device." },
  { when: "1994", title: "Internet and the World Wide Web become accessible", why: "Information and services moved online." },
  { when: "2000", title: "Social media begins: Orkut, Facebook, Twitter (now X)", why: "People could share messages and pictures with large groups." },
  { when: "2010s–now", title: "5G, cloud communication and AI-driven chat and voice", why: "Faster networks and smarter services." },
];

function Timeline({ kind }: { kind: "trains" | "comm" }) {
  const events = kind === "trains" ? TRAIN_EVENTS : COMM_EVENTS;
  const [hidden, setHidden] = useState<boolean>(false);
  const [shown, setShown] = useState<Record<number, boolean>>({});

  return (
    <div className={WIDGET}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label={hidden ? "Show all the years again" : "Hide the years to test yourself"}
          aria-pressed={hidden}
          onClick={() => {
            setHidden((h) => !h);
            setShown({});
          }}
          className={hidden ? BTN_PRIMARY : BTN_SECONDARY}
        >
          {hidden ? "Show all years" : "Test myself: hide the years"}
        </button>
        {hidden && <span className="text-xs text-mute">Guess the year first, then press Reveal.</span>}
      </div>

      <ol className="mt-4 space-y-3">
        {events.map((ev, i) => {
          const visible = !hidden || shown[i] === true;
          return (
            <li key={`${kind}-${i}`} className="flex gap-3">
              <div className="w-28 shrink-0">
                {visible ? (
                  <span className="inline-block rounded-md border border-brand/40 bg-brand/10 px-2 py-1 text-xs font-bold text-brand">
                    {ev.when}
                  </span>
                ) : (
                  <button
                    type="button"
                    aria-label={`Reveal the year for ${ev.title}`}
                    onClick={() => setShown((s) => ({ ...s, [i]: true }))}
                    className="rounded-md border border-brand2/50 bg-page px-2 py-1 text-xs font-bold text-brand2"
                  >
                    Reveal year
                  </button>
                )}
              </div>
              <div className="border-l-2 border-brand/30 pl-3">
                <p className="text-sm font-semibold text-fg">{ev.title}</p>
                <p className="text-sm text-mute">{ev.why}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- widget 5: journey of a voice note ---------- */

interface JourneyStep {
  title: string;
  detail: string;
  fail: string;
}

const JOURNEY: JourneyStep[] = [
  {
    title: "Your phone",
    detail: "You record a voice note and press send. Your phone changes your voice into digital data and sends it out as a signal.",
    fail: "A dead battery or no network signal stops the message before it even leaves your hand.",
  },
  {
    title: "Mobile tower, powered by electricity",
    detail: "A nearby mobile tower catches the signal. Electricity keeps the tower running.",
    fail: "In a power cut without backup, the tower stops working and calls and messages fail in the whole area.",
  },
  {
    title: "Fibre cables underground",
    detail: "The tower passes the message into fibre cables buried under the ground, which carry it over long distances.",
    fail: "If a cable is cut, for example by digging, internet and calls can slow down or stop for many people.",
  },
  {
    title: "Satellites in space",
    detail: "For very long journeys the signal can also travel up to satellites and back down again.",
    fail: "Bad weather or a satellite fault can interrupt the link, especially in remote regions that depend on it.",
  },
  {
    title: "Servers in distant cities",
    detail: "Servers in far-away cities store and forward the message so that it finds the right receiver.",
    fail: "If a data centre goes offline, apps and services that depend on it stop responding.",
  },
  {
    title: "Receiver’s phone",
    detail: "Finally the message reaches the receiver’s phone, which turns the data back into your voice.",
    fail: "If the receiver has no signal or the phone is off, the message waits until the phone is connected again.",
  },
];

function VoiceJourney() {
  const [step, setStep] = useState<number>(0);
  const cur = JOURNEY[step];
  return (
    <div className={WIDGET}>
      <div className="flex flex-wrap items-center gap-2">
        {JOURNEY.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Go to stage ${i + 1}: ${s.title}`}
            aria-pressed={step === i}
            onClick={() => setStep(i)}
            className={
              step === i
                ? "h-9 w-9 rounded-full border border-brand bg-brand text-sm font-bold text-page"
                : i < step
                ? "h-9 w-9 rounded-full border border-brand3/50 bg-brand3/15 text-sm font-semibold text-fg"
                : "h-9 w-9 rounded-full border border-line bg-page text-sm text-mute"
            }
          >
            {i + 1}
          </button>
        ))}
      </div>
      {cur && (
        <div className="mt-4">
          <p className="text-base font-semibold text-brand">
            Stage {step + 1}: {cur.title}
          </p>
          <p aria-live="polite" className="mt-1 text-sm text-fg">
            {cur.detail}
          </p>
          <div className="mt-3 rounded-xl border border-brand4/40 bg-brand4/10 p-3">
            <p className="text-xs font-semibold text-brand4">What if this link fails?</p>
            <p className="mt-1 text-sm text-fg">{cur.fail}</p>
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          aria-label="Go to the previous stage"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={BTN_SECONDARY}
        >
          Back
        </button>
        <button
          type="button"
          aria-label="Go to the next stage"
          onClick={() => setStep((s) => Math.min(JOURNEY.length - 1, s + 1))}
          disabled={step === JOURNEY.length - 1}
          className={BTN_PRIMARY}
        >
          Next stage
        </button>
      </div>
    </div>
  );
}

/* ---------- widget 6: ports by coast ---------- */

type Coast = "West coast" | "East coast" | "Islands";

interface PortRow {
  name: string;
  place: string;
  coast: Coast;
}

const PORTS: PortRow[] = [
  { name: "Kandla", place: "Gujarat", coast: "West coast" },
  { name: "Mumbai", place: "Maharashtra", coast: "West coast" },
  { name: "Jawaharlal Nehru Port", place: "Maharashtra", coast: "West coast" },
  { name: "Mormugao", place: "Goa", coast: "West coast" },
  { name: "New Mangalore", place: "Karnataka", coast: "West coast" },
  { name: "Kochi", place: "Kerala", coast: "West coast" },
  { name: "Tuticorin", place: "Tamil Nadu", coast: "East coast" },
  { name: "Chennai", place: "Tamil Nadu", coast: "East coast" },
  { name: "Ennore", place: "Tamil Nadu", coast: "East coast" },
  { name: "Visakhapatnam", place: "Andhra Pradesh", coast: "East coast" },
  { name: "Paradip", place: "Odisha", coast: "East coast" },
  { name: "Haldia", place: "West Bengal", coast: "East coast" },
  { name: "Kolkata", place: "West Bengal", coast: "East coast" },
  { name: "Port Blair", place: "Andaman and Nicobar Islands", coast: "Islands" },
];

const COAST_FILTERS: ("All" | Coast)[] = ["All", "West coast", "East coast", "Islands"];

function PortsFilter() {
  const [filter, setFilter] = useState<"All" | Coast>("All");
  const rows = PORTS.filter((p) => filter === "All" || p.coast === filter);
  return (
    <div className={WIDGET}>
      <div className="flex flex-wrap gap-2">
        {COAST_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-label={`Show ports: ${f}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={filter === f ? BTN_PRIMARY : BTN_SECONDARY}
          >
            {f}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-mute">
        Showing {rows.length} of {PORTS.length} ports
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <Th>Port</Th>
              <Th>State or union territory</Th>
              <Th>Coast</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.name}>
                <Td>{p.name}</Td>
                <Td>{p.place}</Td>
                <Td>{p.coast}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- quick quiz ---------- */

interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

const QUIZ: QuizQ[] = [
  {
    q: "Which of these is physical infrastructure rather than social infrastructure?",
    options: ["A fire station", "A telecom tower", "A court", "A community centre"],
    answer: 1,
    why: "Towers belong to communication networks, a physical group. Fire stations, courts and community centres are social infrastructure.",
  },
  {
    q: "Which level of government builds and maintains national highways?",
    options: ["Village panchayats", "State public works departments", "The central government", "Private citizens"],
    answer: 2,
    why: "Panchayats look after local roads and states look after state highways. National highways and expressways are the centre’s responsibility.",
  },
  {
    q: "The Dhola Sadiya Bridge connects which two states?",
    options: ["Assam and Meghalaya", "Assam and Arunachal Pradesh", "Sikkim and West Bengal", "Manipur and Nagaland"],
    answer: 1,
    why: "It crosses the Lohit River, a tributary of the Brahmaputra, between Assam and Arunachal Pradesh. It is about 9.15 km long.",
  },
  {
    q: "How are the living root bridges of Meghalaya made?",
    options: [
      "By guiding the roots of the Ficus elastica tree across streams",
      "By weaving bamboo ropes into nets",
      "By casting concrete around tree trunks",
      "By joining steel cables to rocks",
    ],
    answer: 0,
    why: "The Khasi and Jaintia peoples guide roots using bamboo and palm trunks. The bridges keep growing and can last for hundreds of years.",
  },
  {
    q: "Why did the British introduce railways in India in 1853?",
    options: [
      "To help Indian farmers reach schools",
      "To carry raw materials to ports, move British goods and move troops quickly",
      "To start metro services in cities",
      "To reduce the use of ships",
    ],
    answer: 1,
    why: "Cotton and tea had to reach ports for export to Britain, British goods had to travel inland, and troops had to move quickly for tighter control.",
  },
  {
    q: "Which country has the highest share of electrified railways among those compared in the chapter?",
    options: ["China", "France", "Germany", "India"],
    answer: 3,
    why: "India had 97% electrified in 2024, ahead of China (75%), France (61%), Germany (55%) and the United Kingdom (38%).",
  },
  {
    q: "What does TEU stand for?",
    options: ["Total Export Units", "Twenty-foot Equivalent Units", "Trade and Exchange Units", "Transport Efficiency Units"],
    answer: 1,
    why: "TEU measures container capacity and port traffic. One TEU is generally about 33 cubic metres.",
  },
  {
    q: "Which port is the world’s busiest in the chapter’s list for 2024?",
    options: ["Singapore", "Mumbai", "Shanghai", "Rotterdam"],
    answer: 2,
    why: "Shanghai handled 51.51 million TEU. Mumbai, at 7.05 million TEU, is last in the list of nine.",
  },
  {
    q: "Why did J.C. Bose not receive the same worldwide fame as Marconi for wireless transmission?",
    options: [
      "His experiments failed",
      "He never published his results",
      "He rarely patented his inventions",
      "He worked only on plants",
    ],
    answer: 2,
    why: "Marconi patented a similar device in 1901 and won the Nobel Prize in 1909. Bose’s earlier work lacked patent protection.",
  },
  {
    q: "According to the Arthaśāstra, how wide should forest roads and roads inside a city be?",
    options: ["2.5 metres", "8 metres", "16 metres", "30 metres"],
    answer: 1,
    why: "Royal highways and village roads were 16 m, forest and city roads were 8 m, and chariot roads were 2.5 m.",
  },
  {
    q: "Assertion (A): Cargo trains are more energy-efficient than road transport. Reason (R): They use 75–90% less energy than road transport.",
    options: [
      "A and R are both true, and R explains A",
      "A and R are both true, but R does not explain A",
      "A is true but R is false",
      "A is false but R is true",
    ],
    answer: 0,
    why: "The very low energy use is exactly what makes cargo trains more energy-efficient.",
  },
  {
    q: "Assertion (A): A new highway brings only benefits to a village. Reason (R): Highways may take farmland and add noise and pollution.",
    options: [
      "A and R are both true, and R explains A",
      "A and R are both true, but R does not explain A",
      "A is true but R is false",
      "A is false but R is true",
    ],
    answer: 3,
    why: "Highways bring faster travel and new jobs, but they can also cost farmers their land and add noise and pollution. So A is false and R is true.",
  },
];

function Quiz() {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const answered = Object.keys(picked).length;
  const score = QUIZ.filter((item, i) => picked[i] === item.answer).length;

  return (
    <div className={WIDGET}>
      <div className="space-y-5">
        {QUIZ.map((item, qi) => {
          const chosen = picked[qi];
          const done = chosen !== undefined;
          return (
            <div key={`quiz-${qi}`}>
              <p className="text-sm font-semibold text-fg">
                <span className="mr-1.5 text-brand">{qi + 1}.</span>
                {item.q}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {item.options.map((opt, oi) => {
                  let cls = "rounded-lg border border-brand/40 bg-page px-3 py-2 text-left text-sm text-fg";
                  if (done && oi === item.answer)
                    cls = "rounded-lg border border-brand3 bg-brand3/20 px-3 py-2 text-left text-sm text-fg";
                  else if (done && oi === chosen)
                    cls = "rounded-lg border border-brand4 bg-brand4/20 px-3 py-2 text-left text-sm text-fg";
                  return (
                    <button
                      key={`quiz-${qi}-${oi}`}
                      type="button"
                      disabled={done}
                      onClick={() => setPicked((prev) => ({ ...prev, [qi]: oi }))}
                      className={cls}
                    >
                      {done && oi === item.answer ? "✓ " : done && oi === chosen ? "✗ " : ""}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {done && (
                <p className="mt-2 text-sm">
                  <span className={chosen === item.answer ? "font-semibold text-ok" : "font-semibold text-accent"}>
                    {chosen === item.answer ? "Correct. " : "Not quite. "}
                  </span>
                  <span className="text-mute">{item.why}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <p aria-live="polite" className="text-sm font-semibold text-fg">
          {answered === QUIZ.length
            ? `Final score: ${score} out of ${QUIZ.length}`
            : `Answered ${answered} of ${QUIZ.length}`}
        </p>
        <button type="button" aria-label="Reset the quiz and clear all answers" onClick={() => setPicked({})} className={BTN_SECONDARY}>
          Reset quiz
        </button>
      </div>
    </div>
  );
}

/* ---------- the note ---------- */

export default function InfrastructureNote() {
  return (
    <Note
      title="Infrastructure: Engine of India’s Development"
      intro="Switch on a light, send a message, catch a train, buy vegetables grown hundreds of kilometres away — none of it happens by magic. Behind every ordinary day sits a vast web of roads, bridges, railways, ports, cables, towers and power lines, together with schools, hospitals and libraries. This chapter explains what infrastructure is, how each part works and who looks after it, why it is called the engine of India’s development, and what every citizen owes it in return. Figures are as printed in the NCERT textbook (data of 2024–25), so check the latest numbers before quoting them."
      colors={colors}
    >
      <Section title="1. What Is Infrastructure?">
        <p>
          Imagine waking up one morning to find no roads, no buses, no mobile signal, no electricity, no internet
          and no tap water. Life would stall. What is missing in that picture is <Hl>infrastructure</Hl> (the basic
          structures and services that a country, city or village needs in order to function).
        </p>
        <p className="mt-3">
          <Hl>Physical infrastructure</Hl> is the vast network of tangible (touchable, built) structures that keeps
          cities and villages running. It falls into four groups:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Group</Th>
                <Th>Examples</Th>
                <Th>What it makes possible</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Transportation systems</Td>
                <Td>Roads, bridges, railways, airports, seaports</Td>
                <Td>Movement of people and goods</Td>
              </tr>
              <tr>
                <Td>Utilities</Td>
                <Td>Electricity supply, water pipelines</Td>
                <Td>Light, power and clean water for homes and factories</Td>
              </tr>
              <tr>
                <Td>Communication networks</Td>
                <Td>Internet, telephone lines, telecom towers, satellites</Td>
                <Td>Messages, images and videos travelling across distance</Td>
              </tr>
              <tr>
                <Td>Energy infrastructure</Td>
                <Td>Windmills, solar parks, oil and gas pipelines</Td>
                <Td>Producing and delivering the energy that everything else runs on</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          <Hl>Social infrastructure</Hl> is the other half: schools, colleges, training centres, hospitals, health
          centres, police stations, fire stations, courts, parks, libraries and community centres. It supports the
          well-being and development of communities.
        </p>
        <Callout>
          <Hl>The difference in one line:</Hl> physical infrastructure <Hl>carries</Hl> things (people, goods, power,
          messages), while social infrastructure <Hl>grows people</Hl> (their knowledge, health, safety and
          well-being). A country needs both, but this chapter concentrates on the physical kind.
        </Callout>
        <Callout>
          <Hl>Going deeper (beyond the textbook): what makes infrastructure special?</Hl> It is <Hl>shared</Hl> (many
          people use it at once), <Hl>long-lasting</Hl> (it serves for decades), <Hl>costly and large</Hl> (so
          governments usually lead the planning), <Hl>networked</Hl> (a bridge is useless without roads on both
          sides) and it <Hl>needs upkeep</Hl> (potholes and broken streetlights show what happens without it).
        </Callout>
      </Section>

      <Section title="2. Sort It Out: Practice Classifying Infrastructure">
        <p>
          Fourteen items follow. Decide which group each belongs to. The reason appears at once, so you learn from
          every answer.
        </p>
        <div className="mt-4">
          <ClassifySorter />
        </div>
      </Section>

      <Section title="3. Why Infrastructure Is the Backbone of a Nation">
        <p>
          The chapter opens with two stories that show how different pieces of infrastructure fit together like
          puzzle pieces.
        </p>
        <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand2">
          <li>
            <Hl>Rishabh’s journey from Delhi to Nashik</Hl> needed roads, bridges, the metro, trains and buses to
            work one after another. If one link fails, the whole journey is delayed.
          </li>
          <li>
            <Hl>Satish the tomato farmer</Hl> depends on canals and electric pumps for water, roads and bridges to
            carry the crop, cold storage to keep it fresh and a smartphone to find prices and advice.
          </li>
        </ul>
        <p className="mt-3">Try the simulator and see how the weakest link decides the outcome.</p>
        <div className="mt-4">
          <ChainSimulator />
        </div>
        <Callout>
          <Hl>What the simulator teaches:</Hl> infrastructure works as a <Hl>system</Hl>, not as separate parts. A
          modern road is of little use to a farmer whose crop has no water, and a cold store is useless if trucks
          cannot reach it.
        </Callout>

        <p className="mt-5 font-semibold text-fg">Five roles of physical infrastructure in the chapter</p>
        <ol className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
          <li>
            <Hl>Economic connectivity:</Hl> transport joins the places where goods are made or grown to the nearest
            markets, which boosts trade within the country and abroad.
          </li>
          <li>
            <Hl>Historical continuity:</Hl> India has had networks of trade routes since ancient times. Modern
            infrastructure carries that tradition forward.
          </li>
          <li>
            <Hl>Tourism:</Hl> better roads, railways and airports bring visitors to remote areas and give local
            people new work.
          </li>
          <li>
            <Hl>Disaster response:</Hl> in floods or earthquakes, relief teams, medicines and food must reach people
            fast.
          </li>
          <li>
            <Hl>National security:</Hl> defence forces need access to all kinds of terrain, from mountains to
            deserts.
          </li>
        </ol>

        <p className="mt-5 font-semibold text-fg">Think about it: a new highway near a village</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th tone="bg-brand3/15 text-brand3">Benefits</Th>
                <Th tone="bg-brand4/15 text-brand4">Costs and risks</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Reach the city or a bigger hospital faster</Td>
                <Td>Some farmers lose farmland to the road</Td>
              </tr>
              <tr>
                <Td>Farmers send crops to market before they spoil</Td>
                <Td>More noise and air pollution near homes</Td>
              </tr>
              <tr>
                <Td>Children can reach better schools in town</Td>
                <Td>Danger while crossing, especially for children and animals</Td>
              </tr>
              <tr>
                <Td>Shops, dhabas and petrol pumps open, creating jobs</Td>
                <Td>Villagers must adjust to a faster, busier way of life</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout>
          <Hl>A mature answer weighs both columns.</Hl> Development is rarely all good or all bad, so planners must
          compensate people who lose land and reduce harm, for instance with crossings, trees and noise barriers.
        </Callout>
        <Callout>
          <Hl>Direct and indirect benefits:</Hl> ports, highways and airports create <Hl>direct</Hl> jobs in building,
          running and repairing them. They also create <Hl>indirect</Hl> jobs for drivers, shopkeepers, hotel owners,
          warehouse workers and taxi drivers. Cheaper, faster transport lowers the cost of goods, which helps
          businesses grow and hire more people.
        </Callout>
        <Callout>
          <Hl>If there were no internet or phones:</Hl> online classes would stop, payments and documents (such as
          applying for an Aadhaar card online) would be harder, farmers like Satish would not know market prices,
          and calling for help in an emergency would be slow.
        </Callout>
      </Section>

      <Section title="4. Roads and Highways">
        <p>
          As of 2024, India has the <Hl>second-largest road network in the world</Hl>, behind only the United States
          of America. Roads come in four levels, each with its own job and its own caretaker.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Type of road</Th>
                <Th>What it does</Th>
                <Th>Maintained by</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Local or village roads</Td>
                <Td>Connect homes to schools, farms to markets and people to hospitals</Td>
                <Td>Local bodies and panchayats</Td>
              </tr>
              <tr>
                <Td>State highways</Td>
                <Td>Connect towns and districts within a state</Td>
                <Td>State governments, through Public Works Departments</Td>
              </tr>
              <tr>
                <Td>National highways</Td>
                <Td>Connect cities across states</Td>
                <Td>Central government</Td>
              </tr>
              <tr>
                <Td>Expressways</Td>
                <Td>Super-fast roads between cities, linked with stations, airports and ports</Td>
                <Td>Central government</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout>
          <Hl>Going deeper:</Hl> this layering mirrors how India is governed, with the local, state and central
          levels each taking charge of what is closest to them. A village road mainly serves one village, so its
          panchayat looks after it. A highway that links distant cities serves the whole country, so the centre does.
        </Callout>

        <p className="mt-4 font-semibold text-fg">Facts that are often asked</p>
        <ul className="mt-2 list-disc space-y-3 pl-5 marker:text-brand">
          <li>
            India’s national highways stretch about 1,50,000 km (2025).
          </li>
          <li>
            <Hl>NH44</Hl> is the longest national highway: 4,112 km from Srinagar in the north to Kanyakumari in
            the south.
          </li>
          <li>
            The <Hl>Golden Quadrilateral</Hl> is a national highway network joining Delhi, Mumbai, Chennai and
            Kolkata.
          </li>
          <li>
            Landmark structures: the <Hl>Chenab Rail Bridge</Hl> in Jammu and Kashmir, the world’s highest railway
            bridge; <Hl>Atal Setu</Hl> in Maharashtra, India’s longest sea bridge; and the <Hl>Atal Tunnel</Hl> at
            Rohtang, the world’s longest highway tunnel above 10,000 feet.
          </li>
        </ul>

        <p className="mt-5 font-semibold text-fg">Case study 1: Dhola Sadiya Bridge (Bhupen Hazarika Setu)</p>
        <p className="mt-1">
          This 9.15 km bridge crosses the Lohit River, a tributary (a smaller river that joins a larger one) of the
          Brahmaputra, and links <Hl>Assam and Arunachal Pradesh</Hl>.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-brand4/40 bg-brand4/10 p-4">
            <p className="text-sm font-semibold text-brand4">Before the bridge</p>
            <p className="mt-1 text-sm text-fg">People depended on ferries, and ferries could not run during floods.</p>
          </div>
          <div className="rounded-xl border border-brand3/40 bg-brand3/10 p-4">
            <p className="text-sm font-semibold text-brand3">After the bridge</p>
            <p className="mt-1 text-sm text-fg">
              Travel is possible all year and takes four hours less. Farmers market perishable (quickly spoiling)
              produce faster, and patients reach hospitals even during floods.
            </p>
          </div>
        </div>

        <p className="mt-5 font-semibold text-fg">Case study 2: living root bridges of Meghalaya</p>
        <p className="mt-1">
          The Khasi and Jaintia peoples make these bridges, called <Hl>jingkieng jri</Hl> in Khasi, from the roots of
          the Ficus elastica tree (the Indian rubber tree). They guide the roots across streams using bamboo and
          palm trunks. The bridges are alive and keep growing stronger, can last for hundreds of years, and some
          take decades or even centuries to mature.
        </p>
        <Callout>
          <Hl>Two very different bridges, one lesson:</Hl> the Dhola Sadiya Bridge shows modern engineering solving
          a connectivity problem at scale, while the root bridges show traditional knowledge building{" "}
          <Hl>sustainable</Hl> infrastructure that works with nature instead of against it.
        </Callout>
      </Section>

      <Section title="5. Indian Railways">
        <p>
          The British introduced railways in India in <Hl>1853</Hl>, running the first line from Bombay to Thane.
          Their aims were to carry raw materials such as cotton and tea to ports for export to Britain, to move
          British goods across India, to exploit resources, and to move troops quickly for tighter colonial
          control.
        </p>
        <Callout>
          <Hl>A double legacy:</Hl> the railways were built to serve colonial interests, yet over time they became
          the lifeline of the country, moving millions of people and enormous amounts of goods and linking distant
          regions. The same structure can serve different purposes depending on who controls it and why.
        </Callout>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Indian Railways today</Th>
                <Th>Fact</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>World rank of the network</Td>
                <Td>4th largest railway system</Td>
              </tr>
              <tr>
                <Td>Passengers carried</Td>
                <Td>Over 20 million every day, on one of the cheapest train services in the world</Td>
              </tr>
              <tr>
                <Td>Employment</Td>
                <Td>About 1.21 million employees (2024), plus indirect jobs in catering, vending and taxi services</Td>
              </tr>
              <tr>
                <Td>Electrification</Td>
                <Td>97% in 2024, with a target of 100% by 2025</Td>
              </tr>
              <tr>
                <Td>Cargo</Td>
                <Td>Cargo trains use 75–90% less energy than road transport</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-mute">
          The textbook gives 97% and a target of 100% by 2025. Check the latest official figure before quoting
          current status.
        </p>

        <Callout>
          <Hl>Why electrification matters:</Hl> electric trains run on power drawn from overhead wires, so they
          give out no smoke themselves, unlike coal and diesel engines. Cleaner trains help cities breathe easier.
        </Callout>

        <p className="mt-4 font-semibold text-fg">How trains developed</p>
        <p className="mt-1 text-sm text-mute">
          Use the self-test mode to hide the years and check what you remember.
        </p>
        <div className="mt-3">
          <Timeline kind="trains" />
        </div>

        <p className="mt-5 font-semibold text-fg">Let us explore: life around a station</p>
        <p className="mt-1">
          Around railway and metro stations you will find tea stalls, restaurants, bookstalls, pharmacies, taxis,
          auto-rickshaws, porters, hotels and street vendors. A station is more than a place to catch a train: it
          becomes a small marketplace that gives many families a livelihood.
        </p>
      </Section>

      <Section title="6. Metro Train Systems">
        <p>
          Metro trains run in <Hl>23 Indian cities</Hl> over a combined length of more than 1,000 km. India is soon
          expected to have the third-largest metro network in the world, after China and the USA.
        </p>
        <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand3">
          <li>They run on underground and elevated tracks, so they do not compete with road traffic.</li>
          <li>They cut travel time and make daily commutes (regular trips to work or school) reliable.</li>
          <li>
            They reduce road traffic and pollution because they run on electricity. Some, like the Delhi Metro, use
            solar power too.
          </li>
        </ul>
        <Callout>
          <Hl>Going deeper:</Hl> a metro carries a very large number of people at once, so fewer cars and two-wheelers
          are needed on the road. That is why one piece of infrastructure can improve several things together:
          speed, safety, air quality and jobs around stations.
        </Callout>
      </Section>

      <Section title="7. Air Transport">
        <p>
          Air transport is the <Hl>fastest</Hl> mode of transport. Cargo flights carry high-value or perishable
          goods such as vaccines, chemicals and seafood, and they are especially valuable in disasters, because
          aircraft can reach high mountains, deserts, dense forests and distant islands when roads and rails cannot.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Stat label="Airports in India (2025)" value="159" tone="text-brand" />
          <Stat label="Passengers handled, 2024–25" value="About 376 million" tone="text-brand2" />
          <Stat label="Domestic air traffic rank" value="3rd highest in the world" tone="text-brand3" />
        </div>
        <Callout>
          <Hl>Design with nature:</Hl> Kempegowda International Airport in Bengaluru follows a “garden city”
          concept, with bamboo structures, plants and green spaces alongside the latest passenger facilities. It
          shows that modern infrastructure can look after the environment.
        </Callout>
        <p className="mt-4 font-semibold text-fg">Major airports shown in the chapter</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Airport</Th>
                <Th>City and state</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Chhatrapati Shivaji Maharaj International Airport</Td>
                <Td>Mumbai, Maharashtra</Td>
              </tr>
              <tr>
                <Td>Indira Gandhi International Airport</Td>
                <Td>Delhi</Td>
              </tr>
              <tr>
                <Td>Kempegowda International Airport</Td>
                <Td>Bengaluru, Karnataka</Td>
              </tr>
              <tr>
                <Td>Chennai International Airport</Td>
                <Td>Chennai, Tamil Nadu</Td>
              </tr>
              <tr>
                <Td>Netaji Subhash Chandra Bose International Airport</Td>
                <Td>Kolkata, West Bengal</Td>
              </tr>
              <tr>
                <Td>Rajiv Gandhi International Airport</Td>
                <Td>Hyderabad, Telangana</Td>
              </tr>
              <tr>
                <Td>Sardar Vallabhbhai Patel International Airport</Td>
                <Td>Ahmedabad, Gujarat</Td>
              </tr>
              <tr>
                <Td>Dabolim Airport (Goa International Airport)</Td>
                <Td>Goa</Td>
              </tr>
              <tr>
                <Td>Jaipur International Airport</Td>
                <Td>Jaipur, Rajasthan</Td>
              </tr>
              <tr>
                <Td>Navi Mumbai International Airport</Td>
                <Td>Navi Mumbai, Maharashtra</Td>
              </tr>
              <tr>
                <Td>Noida International Airport</Td>
                <Td>Jewar, Uttar Pradesh</Td>
              </tr>
              <tr>
                <Td>Kushok Bakula Rimpochee Airport</Td>
                <Td>Leh, Ladakh</Td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="8. Shipping and Ports">
        <p>
          India has a coastline of about <Hl>11,100 km</Hl>, which connects it by sea to West Asia, Africa and
          Europe. Ships carry heavy goods such as coal, cars and cement at a much lower cost than other modes. India
          has <Hl>12 major ports and 217 minor ports</Hl>, and the cargo they handle has risen by 50% in the past
          decade.
        </p>
        <Callout>
          <Hl>What is a TEU?</Hl> TEU stands for <Hl>Twenty-foot Equivalent Units</Hl>. A standard container is
          about 20 feet long, and one TEU is generally about 33 cubic metres. Counting containers in TEUs lets us
          compare the capacity of ships and the traffic of ports in different countries on the same scale.
        </Callout>
        <p className="mt-4 font-semibold text-fg">Ports on the chapter’s map: filter by coast</p>
        <div className="mt-2">
          <PortsFilter />
        </div>
        <p className="mt-2 text-xs text-mute">
          The chapter counts 12 major ports in total, while the map marks more places, so use this table as a map
          aid and not as a count.
        </p>

        <p className="mt-5 font-semibold text-fg">Choosing the right mode of transport</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Mode</Th>
                <Th>Strength</Th>
                <Th>Limit</Th>
                <Th>Best for</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Road</Td>
                <Td>Reaches almost every village, door to door</Td>
                <Td>Uses more energy per tonne, can be congested</Td>
                <Td>Short and medium trips, last-mile delivery</Td>
              </tr>
              <tr>
                <Td>Rail</Td>
                <Td>Carries many people and heavy goods cheaply with less energy</Td>
                <Td>Runs only where tracks exist</Td>
                <Td>Long-distance passengers, coal, grain</Td>
              </tr>
              <tr>
                <Td>Air</Td>
                <Td>Fastest, reaches difficult terrain</Td>
                <Td>Costly</Td>
                <Td>Vaccines, seafood, urgent relief</Td>
              </tr>
              <tr>
                <Td>Water</Td>
                <Td>Lowest cost for heavy goods</Td>
                <Td>Slowest, needs ports</Td>
                <Td>Coal, cars, cement, containers</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout>
          <Hl>Going deeper:</Hl> there is no single “best” mode. Goods usually travel by a chain of modes, such as
          road to port, ship across the sea, then rail to a city, which is why ports, railways and highways must be
          planned together.
        </Callout>
      </Section>

      <Section title="9. Reading the Numbers: Rail and Port Data">
        <p>
          The chapter uses bar charts to compare India with other countries. Reading a chart well means asking three
          questions: <Hl>who is first, where does India stand, and how big is the gap?</Hl> Switch between the three
          charts below.
        </p>
        <div className="mt-4">
          <DataExplorer />
        </div>
        <Callout>
          <Hl>Chart-reading skill:</Hl> compare values using ratios (“about 4 times as much”) as well as ranks. A
          rank tells you the order but not the distance between places. Notice also that India is{" "}
          <Hl>4th in track length but 1st in electrification</Hl>, so a country can lead in quality while being
          smaller in size.
        </Callout>
      </Section>

      <Section title="10. Communications Infrastructure">
        <p>
          Communication infrastructure means the cables, wireless devices, towers, satellites and data centres that
          carry messages, images and videos from one place to another. Follow a voice note on its journey, and see
          what would happen if any link failed.
        </p>
        <div className="mt-4">
          <VoiceJourney />
        </div>

        <p className="mt-5 font-semibold text-fg">Two big uses of communication networks</p>
        <ul className="mt-2 list-disc space-y-3 pl-5 marker:text-brand2">
          <li>
            <Hl>E-commerce</Hl> is buying or selling products and services on online platforms or over the
            internet.
          </li>
          <li>
            <Hl>E-governance</Hl> is the use of communication technologies by the government to deliver services to
            citizens. For example, the DigiLocker app stores documents such as an Aadhaar card or a driving licence
            online.
          </li>
        </ul>

        <p className="mt-5 font-semibold text-fg">From scarcity to abundance</p>
        <p className="mt-1">
          In the 1990s a mobile call in India could cost up to ₹17 a minute, even for incoming calls. Today India
          has some of the cheapest mobile and internet rates in the world. In 2025 the country had about{" "}
          <Hl>1,160 million</Hl> wireless telephone subscribers and nearly <Hl>900 million</Hl> internet connections.
        </p>

        <p className="mt-5 font-semibold text-fg">The long road from pigeons to 5G</p>
        <div className="mt-3">
          <Timeline kind="comm" />
        </div>
      </Section>

      <Section title="11. J.C. Bose: The Man Who Sent Signals Without Wires">
        <p>
          <Hl>Jagadish Chandra Bose (1858–1937)</Hl> was an Indian scientist who pioneered wireless transmission
          using microwaves in the millimetre range. In 1895 in Calcutta he showed that signals could pass through a
          wall, using a bell and a remote-controlled gun.
        </p>
        <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand">
          <li>
            He made a new type of <Hl>coherer</Hl> (a key part of early wireless systems that detected the signals).
          </li>
          <li>
            He developed the <Hl>galena crystal detector</Hl> (galena is a common lead ore and an early kind of
            semiconductor), as well as antennas and waveguides.
          </li>
          <li>He also pioneered research on plant physiology.</li>
          <li>In 1917 he founded the Bose Institute, which has promoted research in physics, biology and environmental sciences.</li>
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
            <p className="text-sm font-semibold text-brand">J.C. Bose</p>
            <p className="mt-1 text-sm text-fg">Demonstrated wireless transmission in 1895. Rarely patented his inventions.</p>
          </div>
          <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
            <p className="text-sm font-semibold text-brand2">Guglielmo Marconi</p>
            <p className="mt-1 text-sm text-fg">
              Patented a similar device in 1901, sent a radio signal across the Atlantic the same year, and won the
              Nobel Prize in Physics in 1909.
            </p>
          </div>
        </div>
        <Callout>
          <Hl>The lesson about patents:</Hl> a <Hl>patent</Hl> is a right given by a government or institution to be
          the only person or company allowed to make, sell or use an invention for a fixed number of years.
          Patents protect inventors and bring them recognition, income and credit. Bose’s work came first, but
          without patents he did not receive the same worldwide recognition.
        </Callout>
      </Section>

      <Section title="12. Looking After Infrastructure: Responsibility and Sustainability">
        <p>
          Building infrastructure is only half the job. Caring for it is a <Hl>collective responsibility</Hl> (a duty
          shared by everyone). Littered roads, stains on buildings, writing on monuments, potholes and broken
          streetlights make life harder and cost everyone money to repair.
        </p>
        <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand3">
          <li>
            <Hl>Better local services:</Hl> panchayats and municipalities need to improve waste management, sewers,
            traffic management, clean water and pedestrian footpaths.
          </li>
          <li>
            <Hl>Safe and sustainable design</Hl> (meeting today’s needs without harming future generations): use
            cleaner energy and eco-friendly materials, and fit solar panels on buildings to reduce emissions.
          </li>
          <li>
            <Hl>Inclusive design:</Hl> infrastructure should serve the needs of children, the elderly and persons
            with disabilities.
          </li>
          <li>
            <Hl>Wildlife-friendly design:</Hl> for example, alarm systems that warn when animals cross railway
            tracks.
          </li>
          <li>
            <Hl>Citizen action:</Hl> use public facilities responsibly and report damage to the authorities.
          </li>
        </ul>

        <p className="mt-5 font-semibold text-fg">Infrastructure rules in Kautilya’s Arthaśāstra</p>
        <p className="mt-1">
          The Arthaśāstra, an ancient Indian text on governance, shows that looking after infrastructure has deep
          roots in India. The state and local assemblies (sabhās) took part in building and maintaining roads and
          waterways, and the text set road widths by purpose.
        </p>
        <div className="mt-3 rounded-xl border border-brand/30 bg-page p-4">
          <Bars
            rows={[
              { label: "Royal highways, countryside, port-town and village roads", value: 16 },
              { label: "Forest roads and roads inside the city", value: 8 },
              { label: "Chariot roads", value: 2.5 },
            ]}
            highlight="Forest roads and roads inside the city"
            unit="m"
            decimals={1}
          />
        </div>
        <p className="mt-3">
          It also prescribed punishments and fines: a severe penalty for breaking the dam of a reservoir, and fines
          for trespassing into public parks or blocking paths to waterworks and forests.
        </p>
        <Callout>
          <Hl>Community Responsibility Pact:</Hl> we will keep public places clean and never litter, protect public
          property, use water and electricity wisely, follow traffic rules, plant and protect trees, report damaged
          roads and streetlights, and encourage others to do the same.
        </Callout>
        <Callout>
          <Hl>Can development and the environment go together?</Hl> Yes, by planting trees, protecting habitats,
          using renewable energy, managing waste, saving water and choosing eco-friendly construction methods.
          Innovations such as electric buses, smart traffic lights, rainwater harvesting and waste-to-energy plants
          show how.
        </Callout>
      </Section>

      <Section title="13. Key Terms">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Term</Th>
                <Th>Meaning</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Infrastructure</Td>
                <Td>Basic structures and services needed for a country, city or village to function</Td>
              </tr>
              <tr>
                <Td>Physical infrastructure</Td>
                <Td>Built networks for transport, utilities, communication and energy</Td>
              </tr>
              <tr>
                <Td>Social infrastructure</Td>
                <Td>Schools, hospitals, libraries, courts and similar facilities that support well-being</Td>
              </tr>
              <tr>
                <Td>Expressway</Td>
                <Td>A super-fast road linking cities, built and maintained by the central government</Td>
              </tr>
              <tr>
                <Td>Golden Quadrilateral</Td>
                <Td>A highway network joining Delhi, Mumbai, Chennai and Kolkata</Td>
              </tr>
              <tr>
                <Td>Electrification</Td>
                <Td>Running trains on electric power instead of coal or diesel</Td>
              </tr>
              <tr>
                <Td>TEU</Td>
                <Td>Twenty-foot Equivalent Unit, a measure of container capacity and port traffic</Td>
              </tr>
              <tr>
                <Td>E-commerce</Td>
                <Td>Buying and selling over the internet</Td>
              </tr>
              <tr>
                <Td>E-governance</Td>
                <Td>Government services delivered using communication technology</Td>
              </tr>
              <tr>
                <Td>Patent</Td>
                <Td>Exclusive right to make, sell or use an invention for a fixed period</Td>
              </tr>
              <tr>
                <Td>Coherer</Td>
                <Td>An early device that detected wireless signals</Td>
              </tr>
              <tr>
                <Td>Sustainable</Td>
                <Td>Meeting present needs without harming the needs of future generations</Td>
              </tr>
              <tr>
                <Td>Arthaśāstra</Td>
                <Td>Kautilya’s ancient Indian text on governance and statecraft</Td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="14. Quick Quiz: Check Yourself">
        <p>
          Twelve questions, including two assertion–reason questions. Pick an answer to see the reason at once.
        </p>
        <div className="mt-4">
          <Quiz />
        </div>
      </Section>

      <Section title="15. Practice Questions">
        <p className="font-semibold text-brand">A. Very short answer</p>
        <ol className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
          <li>Define physical infrastructure.</li>
          <li>Give two examples of social infrastructure.</li>
          <li>Which country has a larger road network than India?</li>
          <li>Name India’s longest national highway and its two end points.</li>
          <li>What does TEU stand for?</li>
          <li>In which year were railways introduced in India?</li>
          <li>Who demonstrated wireless transmission in Calcutta in 1895?</li>
          <li>What is e-governance? Give one example.</li>
        </ol>

        <p className="mt-5 font-semibold text-brand2">B. Short answer</p>
        <ol start={9} className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand2">
          <li>How do state highways differ from national highways?</li>
          <li>Explain how the Dhola Sadiya Bridge has changed life for the people near it.</li>
          <li>State the purposes for which the British introduced railways. How has their role changed?</li>
          <li>Describe the journey of a voice note from one phone to another.</li>
          <li>Why did J.C. Bose not receive the same worldwide recognition as Marconi? What is a patent?</li>
        </ol>

        <p className="mt-5 font-semibold text-brand3">C. Long answer</p>
        <ol start={14} className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand3">
          <li>“Infrastructure is the engine of development.” Explain, using the example of Satish the farmer.</li>
          <li>Trace the development of communication from ancient times to today and explain its effects on daily life.</li>
          <li>“Taking care of public infrastructure is a collective responsibility.” Discuss the role of citizens and the government.</li>
        </ol>

        <p className="mt-5 font-semibold text-brand4">D. Case-based</p>
        <div className="mt-2 rounded-xl border border-brand4/40 bg-brand4/5 p-4 text-sm">
          <p className="font-semibold text-fg">Case 1: A bridge over a river</p>
          <p className="mt-1">
            Before a long bridge was built across a river between two states, people crossed by ferry. When floods
            came, the ferries stopped for days. Farmers could not take vegetables to the market and patients could
            not reach the hospital. After the bridge opened, the journey became four hours shorter.
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>What problem did people face before the bridge?</li>
            <li>Name one benefit for farmers and one for patients.</li>
            <li>Is this physical or social infrastructure? Give a reason.</li>
          </ol>
        </div>
        <div className="mt-3 rounded-xl border border-brand4/40 bg-brand4/5 p-4 text-sm">
          <p className="font-semibold text-fg">Case 2: Reading data</p>
          <p className="mt-1">
            Electrified share of railways, 2024: India 97%, China 75%, France 61%, Germany 55%, United Kingdom 38%.
            Railway track length, 2024: USA 2,93,564 km, India 69,181 km.
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Which country leads in electrification, and by how many percentage points over the next country?</li>
            <li>How much higher is India’s share than the United Kingdom’s?</li>
            <li>Roughly how many times longer is the USA’s track than India’s?</li>
            <li>Give one reason why electrified railways are better for the environment.</li>
          </ol>
        </div>

        <p className="mt-5 font-semibold text-brand">E. Thinking and values</p>
        <ol start={17} className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
          <li>A new expressway passes through a village and farmers lose some land. Suggest three steps to make this development fair.</li>
          <li>
            Choose the best mode of transport and give a reason: (a) 500 tonnes of coal (b) vaccines for a hill town
            cut off by floods (c) students going to school within a big city.
          </li>
          <li>Why is a Community Responsibility Pact useful even when the government maintains public infrastructure?</li>
          <li>
            A school is planned in a hilly, flood-prone village. List the infrastructure it needs and say how to make
            it sustainable and inclusive.
          </li>
        </ol>

        <details className="mt-5 rounded-xl border border-line bg-tint p-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand">Show answer key</summary>
          <div className="mt-3 space-y-3 text-sm text-mute">
            <p className="font-semibold text-fg">A. Very short answer</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>It is the vast network of tangible structures, such as roads, railways, ports, utilities, energy and communication systems, that keeps cities and villages functioning.</li>
              <li>Any two of: schools, hospitals, libraries, courts, parks, police stations, fire stations, community centres.</li>
              <li>The United States of America.</li>
              <li>NH44, from Srinagar in the north to Kanyakumari in the south, about 4,112 km.</li>
              <li>Twenty-foot Equivalent Units.</li>
              <li>1853.</li>
              <li>Jagadish Chandra Bose.</li>
              <li>The use of communication technology by the government to deliver services to citizens, for example the DigiLocker app.</li>
            </ol>

            <p className="font-semibold text-fg">B. Short answer</p>
            <ol start={9} className="list-decimal space-y-1 pl-5">
              <li>State highways join towns and districts within one state and are looked after by the state’s Public Works Department. National highways join cities across states and are the central government’s responsibility.</li>
              <li>Earlier people used ferries, which stopped in floods. The bridge gives all-year travel and saves four hours. Farmers can send perishable produce to markets faster and patients can reach hospitals even during floods.</li>
              <li>In 1853 the British wanted to carry raw materials like cotton and tea to ports for export, move British goods inland, exploit resources and move troops quickly. Today the railways serve the nation: they carry over 20 million passengers a day, employ about 1.21 million people and are 97% electrified.</li>
              <li>Electricity powers a mobile tower, which passes the message into underground fibre cables. It may travel via satellites, passes through servers in distant cities and finally reaches the receiver’s phone.</li>
              <li>Bose rarely patented his inventions, so his work lacked legal protection, while Marconi patented a similar device in 1901 and won the Nobel Prize in 1909. A patent is a right to be the only maker, seller or user of an invention for a fixed number of years.</li>
            </ol>

            <p className="font-semibold text-fg">C. Long answer (model points)</p>
            <ol start={14} className="list-decimal space-y-2 pl-5">
              <li>
                Infrastructure supports every economic activity. Satish needs canals and electric pumps to water the
                crop, roads and bridges to carry it, cold storage to keep it fresh and a phone to learn prices.
                If one link is missing, the crop dries, rots or sells cheaply. Infrastructure also creates jobs,
                attracts investment, connects remote areas, helps in disasters and strengthens security, which is
                why it drives growth and a better quality of life.
              </li>
              <li>
                Early messages travelled by pigeons, runners and horse couriers. Printing brought newspapers
                (1605 abroad, the Bengal Gazette in India in 1780). The telegraph (1844), telephone (1876) and Bose’s
                wireless demonstration (1895) followed. Radio (AIR from 1930), television (1927), computers (1970s),
                email, the internet (1994), the smartphone (1993), social media (2000) and 5G, cloud and AI now
                connect people instantly. Effects: online classes, e-commerce, e-governance such as DigiLocker, quick
                disaster alerts and very cheap calls.
              </li>
              <li>
                Littering, damage, potholes and broken lights lower ease of living and cost everyone money. The
                government builds, maintains and can fine offenders, as in the Arthaśāstra. Citizens must use
                facilities responsibly, report damage and support sustainable and inclusive design (solar panels,
                designs for children, the elderly and disabled persons, wildlife-friendly crossings).
              </li>
            </ol>

            <p className="font-semibold text-fg">D. Case-based</p>
            <ol start={1} className="list-decimal space-y-1 pl-5">
              <li>Case 1: (a) Ferries could not run during floods, so people were cut off. (b) Farmers reach markets faster, and patients reach hospitals even in floods. (c) Physical infrastructure, because a bridge is a built transportation structure.</li>
              <li>Case 2: (a) India, by 97 − 75 = 22 percentage points over China. (b) 97 − 38 = 59 percentage points. (c) 2,93,564 ÷ 69,181 is about 4.2 times. (d) Electric trains give out no smoke themselves, so they cause less air pollution than coal or diesel trains.</li>
            </ol>

            <p className="font-semibold text-fg">E. Thinking and values</p>
            <ol start={17} className="list-decimal space-y-1 pl-5">
              <li>Pay fair compensation, plan safe crossings and noise or pollution barriers, plant trees, and consult villagers early; also create local jobs from the project.</li>
              <li>(a) Ship or rail, which is cheapest and uses least energy for heavy goods. (b) Air, the fastest way to reach cut-off places. (c) Metro or bus, which are cheap, frequent and reduce traffic.</li>
              <li>Because the government cannot watch every place all the time. Citizens use the facilities daily, notice problems first and can prevent damage, so shared responsibility keeps infrastructure working and saves public money.</li>
              <li>Needs: a road that does not flood, reliable electricity and water, communication and internet, drainage, safe buildings, a health post and shelter. Sustainable: solar panels, rainwater harvesting, trees, waste segregation. Inclusive: ramps, accessible toilets and safe paths for children and the elderly.</li>
            </ol>
          </div>
        </details>
      </Section>

      <Section title="16. Quick Revision Sheet">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Topic</Th>
                <Th>Key numbers and facts</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Roads</Td>
                <Td>2nd-largest network after the USA (2024); NH44 is 4,112 km from Srinagar to Kanyakumari; Golden Quadrilateral joins Delhi, Mumbai, Chennai and Kolkata</Td>
              </tr>
              <tr>
                <Td>Dhola Sadiya Bridge</Td>
                <Td>9.15 km; Assam and Arunachal Pradesh; Lohit River; saves 4 hours</Td>
              </tr>
              <tr>
                <Td>Railways</Td>
                <Td>Introduced 1853; 4th largest; 20 million passengers a day; 1.21 million employees; 97% electrified; cargo uses 75–90% less energy than roads; track length 69,181 km (4th)</Td>
              </tr>
              <tr>
                <Td>Metro</Td>
                <Td>23 cities; over 1,000 km; third-largest network expected</Td>
              </tr>
              <tr>
                <Td>Air</Td>
                <Td>159 airports (2025); about 376 million passengers (2024–25); 3rd highest domestic traffic</Td>
              </tr>
              <tr>
                <Td>Ports</Td>
                <Td>11,100 km coastline; 12 major and 217 minor ports; cargo up 50% in a decade; 1 TEU is about 33 cubic metres; Shanghai 51.51 and Mumbai 7.05 million TEU</Td>
              </tr>
              <tr>
                <Td>Communication</Td>
                <Td>1,160 million wireless subscribers and about 900 million internet connections (2025); calls cost up to ₹17 a minute in the 1990s</Td>
              </tr>
              <tr>
                <Td>J.C. Bose</Td>
                <Td>1858–1937; wireless demonstration 1895; Bose Institute 1917; Marconi patented in 1901 and won the Nobel Prize in 1909</Td>
              </tr>
              <tr>
                <Td>Arthaśāstra</Td>
                <Td>Road widths of 16 m, 8 m and 2.5 m, plus fines for damaging public works</Td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-brand4">
          <li>
            <Hl>Physical infrastructure</Hl> has four groups (transport, utilities, communication, energy);{" "}
            <Hl>social infrastructure</Hl> includes schools, hospitals and similar facilities.
          </li>
          <li>
            Infrastructure works as a <Hl>system</Hl>: the weakest link decides the result, as Satish’s story shows.
          </li>
          <li>
            It drives growth through <Hl>connectivity, jobs, trade, tourism, disaster response and security</Hl>,
            but projects must weigh costs such as lost land, noise and pollution.
          </li>
          <li>
            Different modes suit different needs: road for reach, rail for heavy loads, air for speed, ships for
            bulk.
          </li>
          <li>
            Caring for infrastructure is a <Hl>collective responsibility</Hl>, with sustainable and inclusive design
            for the future.
          </li>
        </ul>

        <Callout>
          <Hl>Remember:</Hl> the statistics are as printed in the textbook for 2024–25. In an exam, quote the
          textbook figures, and in real life check the latest official data.
        </Callout>
      </Section>
    </Note>
  );
}
