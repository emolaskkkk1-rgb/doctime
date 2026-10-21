import { useEffect, useMemo, useState } from 'react'
import { t, Lang } from './i18n'
import { DOCS, SPECS, DISTRICTS, INS, HOURS, Doc, reviewsFor, isBusy, nextFree, dayLabel } from './data'

type View =
  | { p: 'home' }
  | { p: 'docs'; q?: string; spec?: string }
  | { p: 'doc'; id: number }
  | { p: 'book'; id: number; day: number; hour: number }
  | { p: 'done'; id: number; day: number; hour: number }
  | { p: 'privacy' }

type Ctx = { l: Lang; T: (k: string) => string; go: (v: View) => void; booked: Set<string> }
const hide = (e: any) => { e.currentTarget.style.display = 'none' }
const btn = 'rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-ink disabled:opacity-40'
const card = 'rounded-xl border border-ink/10 bg-white'
const field = 'w-full rounded-lg border border-ink/25 bg-white px-3 py-3'

function Avatar({ d, size = 64 }: { d: Doc; size?: number }) {
  return (
    <div className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-tint font-semibold text-brand"
      style={{ width: size, height: size }}>
      {d.en[0]}
      <img src={`/images/doctor-${((d.id - 1) % 6) + 1}.jpg`} alt="" onError={hide}
        className="absolute inset-0 h-full w-full object-cover" />
    </div>
  )
}

function Header({ c, setL }: { c: Ctx; setL: (l: Lang) => void }) {
  const { l, T, go } = c
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <button onClick={() => go({ p: 'home' })} className="flex items-center gap-2 text-xl font-bold text-brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
          </svg>
          DocTime
        </button>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <button onClick={() => go({ p: 'docs' })}>{T('nav_doctors')}</button>
          <button className="hidden md:inline" onClick={() => {
            go({ p: 'home' }); setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), 50)
          }}>{T('nav_how')}</button>
          <button className="hidden md:inline" onClick={() => go({ p: 'privacy' })}>{T('nav_privacy')}</button>
          <div className="flex overflow-hidden rounded-lg border border-ink/20" role="group" aria-label="Language">
            {(['ka', 'en'] as Lang[]).map((x) => (
              <button key={x} onClick={() => setL(x)} aria-pressed={l === x}
                className={`px-3 py-1.5 ${l === x ? 'bg-brand text-white' : 'bg-white'}`}>{x.toUpperCase()}</button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

function Footer({ c }: { c: Ctx }) {
  const { T, go } = c
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:justify-between">
        <div><div className="text-lg font-bold text-white">DocTime</div><p className="text-sm">{T('footer_desc')}</p></div>
        <div className="flex gap-6 text-sm">
          <button onClick={() => go({ p: 'docs' })}>{T('nav_doctors')}</button>
          <button onClick={() => go({ p: 'privacy' })}>{T('nav_privacy')}</button>
        </div>
        <p className="text-sm">© 2026 DocTime · {T('rights')}</p>
      </div>
    </footer>
  )
}

function Home({ c }: { c: Ctx }) {
  const { l, T, go } = c
  const [q, setQ] = useState('')
  const sug = q.trim().length
    ? [
        ...Object.keys(SPECS).filter((s) => SPECS[s][l].toLowerCase().includes(q.toLowerCase())).map((s) => ({ k: 's' + s, label: SPECS[s][l], v: { p: 'docs', spec: s } as View })),
        ...DOCS.filter((d) => d[l].toLowerCase().includes(q.toLowerCase())).map((d) => ({ k: 'd' + d.id, label: `${d[l]} · ${SPECS[d.spec][l]}`, v: { p: 'doc', id: d.id } as View })),
      ].slice(0, 5)
    : []
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <video autoPlay muted loop playsInline poster="/images/hero.jpg" src="/hero.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-30" onError={hide} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{T('hero_title')}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{T('hero_sub')}</p>
          <div className="relative mt-8 max-w-xl">
            <div className="flex gap-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('search_ph')} aria-label={T('search_ph')}
                onKeyDown={(e) => e.key === 'Enter' && go({ p: 'docs', q })}
                className="w-full rounded-lg bg-white px-4 py-4 text-ink" />
              <button className={btn + ' shrink-0 !bg-[#f2b84b] !text-ink'} onClick={() => go({ p: 'docs', q })}>{T('search_btn')}</button>
            </div>
            {sug.length > 0 && (
              <ul className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-lg bg-white text-ink shadow-lg">
                {sug.map((s) => (
                  <li key={s.k}><button className="w-full px-4 py-3 text-left hover:bg-tint" onClick={() => go(s.v)}>{s.label}</button></li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.keys(SPECS).map((s) => (
              <button key={s} onClick={() => go({ p: 'docs', spec: s })}
                className="rounded-full border border-white/40 px-4 py-2 text-sm hover:bg-white/15">{SPECS[s][l]}</button>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-14">
        <h2 className="text-2xl font-bold">{T('how_title')}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className={card + ' p-5'}>
              <div className="font-bold text-brand">{n}. {T(`how${n}_t`)}</div>
              <p className="mt-1">{T(`how${n}_d`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="text-2xl font-bold">{T('trust_title')}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-xl bg-tint p-5">
              <div className="font-semibold">{T(`trust${n}_t`)}</div>
              <p className="mt-1 text-ink/80">{T(`trust${n}_d`)}</p>
              {n === 3 && <button className="mt-2 font-medium text-brand underline" onClick={() => go({ p: 'privacy' })}>{T('nav_privacy')}</button>}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Docs({ c, init }: { c: Ctx; init: { q?: string; spec?: string } }) {
  const { l, T, go, booked } = c
  const [q, setQ] = useState(init.q || '')
  const [spec, setSpec] = useState(init.spec || '')
  const [maxP, setMaxP] = useState(150)
  const [dist, setDist] = useState('')
  const [ins, setIns] = useState('')
  const [minR, setMinR] = useState(0)
  const [vid, setVid] = useState(false)
  const [sort, setSort] = useState('time')
  const [cmp, setCmp] = useState<number[]>([])
  const [show, setShow] = useState(false)
  const list = useMemo(() => {
    const ql = q.toLowerCase()
    const r = DOCS.filter((d) =>
      (!spec || d.spec === spec) && d.price <= maxP && (!dist || d.dist === dist) &&
      (!ins || d.ins.includes(ins)) && d.rating >= minR && (!vid || d.video) &&
      (!ql || d[l].toLowerCase().includes(ql) || SPECS[d.spec][l].toLowerCase().includes(ql)))
    const when = (d: Doc) => { const n = nextFree(d.id, booked); return n ? n.day * 24 + n.hour : 999 }
    return r.sort((a, b) => sort === 'price' ? a.price - b.price : sort === 'rating' ? b.rating - a.rating : when(a) - when(b))
  }, [q, spec, maxP, dist, ins, minR, vid, sort, l, booked])
  const toggle = (id: number) => setCmp((x) => x.includes(id) ? x.filter((i) => i !== id) : x.length < 3 ? [...x, id] : x)
  const chosen = DOCS.filter((d) => cmp.includes(d.id))
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('search_ph')} aria-label={T('search_ph')} className={field} />
      <details className={card + ' mt-4 p-4 md:open'} open>
        <summary className="cursor-pointer font-semibold">{T('filters')}</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="block text-sm">{T('specialty')}
            <select className={field} value={spec} onChange={(e) => setSpec(e.target.value)}>
              <option value="">{T('all')}</option>
              {Object.keys(SPECS).map((s) => <option key={s} value={s}>{SPECS[s][l]}</option>)}
            </select></label>
          <label className="block text-sm">{T('district')}
            <select className={field} value={dist} onChange={(e) => setDist(e.target.value)}>
              <option value="">{T('all')}</option>
              {Object.keys(DISTRICTS).map((s) => <option key={s} value={s}>{DISTRICTS[s][l]}</option>)}
            </select></label>
          <label className="block text-sm">{T('insurance_f')}
            <select className={field} value={ins} onChange={(e) => setIns(e.target.value)}>
              <option value="">{T('all')}</option>
              {INS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select></label>
          <label className="block text-sm">{T('price_max')}: <b>{maxP} ₾</b>
            <input type="range" min={60} max={150} step={5} value={maxP} onChange={(e) => setMaxP(+e.target.value)} className="w-full accent-[#0e7c7b]" /></label>
          <label className="block text-sm">{T('rating_min')}
            <select className={field} value={minR} onChange={(e) => setMinR(+e.target.value)}>
              {[0, 4, 4.5, 4.8].map((r) => <option key={r} value={r}>{r === 0 ? T('all') : `${r}+`}</option>)}
            </select></label>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input type="checkbox" className="h-5 w-5 accent-[#0e7c7b]" checked={vid} onChange={(e) => setVid(e.target.checked)} />{T('video')}</label>
        </div>
      </details>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium">{list.length} {T('found')}</p>
        <label className="flex items-center gap-2 text-sm">{T('sort')}
          <select className="rounded-lg border border-ink/25 bg-white px-3 py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="time">{T('sort_time')}</option><option value="price">{T('sort_price')}</option><option value="rating">{T('sort_rating')}</option>
          </select></label>
      </div>
      {list.length === 0 && <p className="mt-8 text-center">{T('no_results')}</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list.map((d) => {
          const n = nextFree(d.id, booked)
          return (
            <article key={d.id} className={card + ' p-4'}>
              <div className="flex gap-4">
                <Avatar d={d} />
                <div className="min-w-0 flex-1">
                  <button className="text-left text-lg font-semibold hover:text-brand" onClick={() => go({ p: 'doc', id: d.id })}>{d[l]}</button>
                  <div className="text-sm text-ink/75">{SPECS[d.spec][l]} · {d.years} {T('years')}</div>
                  <div className="text-sm">★ {d.rating} ({d.count} {T('reviews')}) · {DISTRICTS[d.dist][l]}</div>
                  {d.video && <span className="mt-1 inline-block rounded-full bg-tint px-2 py-0.5 text-xs text-brand">{T('video_badge')}</span>}
                </div>
                <div className="text-right text-xl font-bold text-brand">{d.price} ₾</div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-3">
                <div className="text-sm"><span className="text-ink/70">{T('nearest')}: </span>
                  <b className="text-free">{n ? `${dayLabel(n.day, l)}, ${n.hour}:00` : '—'}</b></div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-sm">
                    <input type="checkbox" className="h-5 w-5 accent-[#0e7c7b]" checked={cmp.includes(d.id)} onChange={() => toggle(d.id)} />{T('compare')}</label>
                  <button className={btn + ' !py-2'} onClick={() => go({ p: 'doc', id: d.id })}>{T('book')}</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {cmp.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white p-3 text-center">
          <button className={btn} onClick={() => setShow(true)}>{T('compare')} ({cmp.length})</button>
        </div>
      )}
      {show && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setShow(false)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <table className="w-full text-left text-sm">
              <thead><tr><th></th>{chosen.map((d) => <th key={d.id} className="p-2">{d[l]}</th>)}</tr></thead>
              <tbody>
                {([
                  ['specialty', (d: Doc) => SPECS[d.spec][l]], ['years', (d: Doc) => d.years],
                  ['sort_price', (d: Doc) => `${d.price} ₾`], ['sort_rating', (d: Doc) => `★ ${d.rating} (${d.count})`],
                  ['district', (d: Doc) => DISTRICTS[d.dist][l]], ['insurance_f', (d: Doc) => d.ins.join(', ')],
                  ['video', (d: Doc) => (d.video ? '✓' : '—')],
                ] as [string, (d: Doc) => any][]).map(([k, f]) => (
                  <tr key={k} className="border-t border-ink/10"><th className="p-2 font-medium">{T(k)}</th>{chosen.map((d) => <td key={d.id} className="p-2">{f(d)}</td>)}</tr>
                ))}
              </tbody>
            </table>
            <button className={btn + ' mt-4'} onClick={() => setShow(false)}>{T('close')}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Profile({ c, id }: { c: Ctx; id: number }) {
  const { l, T, go, booked } = c
  const d = DOCS.find((x) => x.id === id)!
  const first = nextFree(id, booked)
  const [day, setDay] = useState(first ? first.day : 0)
  const [hour, setHour] = useState<number | null>(first ? first.hour : null)
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-28 md:pb-8">
      <button className="mb-4 text-brand underline" onClick={() => go({ p: 'docs' })}>← {T('back')}</button>
      <div className={card + ' flex flex-wrap items-center gap-5 p-5'}>
        <Avatar d={d} size={96} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{d[l]}</h1>
          <div>{SPECS[d.spec][l]} · {d.years} {T('years')}</div>
          <div>★ {d.rating} ({d.count} {T('reviews')}) · {T('clinic_area')}: {DISTRICTS[d.dist][l]}</div>
          <div className="text-sm text-ink/75">{T('insurance_f')}: {d.ins.join(', ')}</div>
        </div>
        <div className="text-right"><div className="text-3xl font-bold text-brand">{d.price} ₾</div><div className="max-w-[14rem] text-xs text-ink/70">{T('no_fee')}</div></div>
      </div>

      <section className={card + ' mt-5 p-5'}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{T('choose_time')}</h2>
          {first && <button className="text-sm font-medium text-free underline" onClick={() => { setDay(first.day); setHour(first.hour) }}>
            {T('earliest')}: {dayLabel(first.day, l)}, {first.hour}:00</button>}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 14 }, (_, i) => (
            <button key={i} onClick={() => { setDay(i); setHour(null) }} aria-pressed={day === i}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${day === i ? 'border-brand bg-brand text-white' : 'border-ink/20 bg-white'}`}>{dayLabel(i, l)}</button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {HOURS.map((h) => {
            const b = isBusy(id, day, h, booked)
            return (
              <button key={h} disabled={b} onClick={() => setHour(h)} aria-pressed={hour === h}
                className={`rounded-lg border py-3 font-medium ${b ? 'cursor-not-allowed border-ink/10 bg-ink/5 text-ink/35 line-through' : hour === h ? 'border-free bg-free text-white' : 'border-free text-free hover:bg-free/10'}`}>{h}:00</button>
            )
          })}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-ink/70"><span className="text-free">■ {T('free')}</span><span>■ {T('busy')}</span></div>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-semibold">{T('about')}</h2>
        <p className="mt-1">{T('about_txt')} {SPECS[d.spec][l]}, {d.years} {T('years')}.</p>
        <h2 className="mt-5 text-lg font-semibold">★ {d.rating} · {d.count} {T('reviews')}</h2>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {reviewsFor(id).map((r, i) => (
            <div key={i} className={card + ' p-4 text-sm'}>
              <div className="font-semibold">{r.a[l]} <span className="text-[#b7791f]">{'★'.repeat(r.s)}</span></div>
              <p className="mt-1">{r[l]}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white p-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
        <button className={btn + ' w-full'} disabled={hour === null} onClick={() => go({ p: 'book', id, day, hour: hour! })}>
          {T('book')} {hour !== null && `· ${dayLabel(day, l)}, ${hour}:00 · ${d.price} ₾`}</button>
      </div>
    </div>
  )
}

function Booking({ c, v, onDone }: { c: Ctx; v: { id: number; day: number; hour: number }; onDone: () => void }) {
  const { l, T, go } = c
  const d = DOCS.find((x) => x.id === v.id)!
  const [s, setS] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [acc, setAcc] = useState(false)
  const [err, setErr] = useState(false)
  const when = `${dayLabel(v.day, l)}, ${v.hour}:00`
  const next = () => {
    if (s === 2 && (!name.trim() || phone.replace(/\D/g, '').length < 9)) return setErr(true)
    setErr(false); setS(s + 1)
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <ol className="mb-6 flex gap-2 text-sm">
        {[1, 2, 3].map((n) => (
          <li key={n} className={`flex-1 rounded-lg px-2 py-2 text-center ${s >= n ? 'bg-brand text-white' : 'bg-white text-ink/60'}`}>{n}. {T(`step${n}`)}</li>
        ))}
      </ol>
      <div className={card + ' p-5'}>
        <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
          <Avatar d={d} size={48} />
          <div className="flex-1"><div className="font-semibold">{d[l]}</div><div className="text-sm">{SPECS[d.spec][l]}</div></div>
          <div className="text-xl font-bold text-brand">{d.price} ₾</div>
        </div>
        <div className="mt-4 flex items-center justify-between"><span className="font-medium">{when}</span>
          {s === 1 && <button className="text-brand underline" onClick={() => go({ p: 'doc', id: v.id })}>{T('change')}</button>}</div>
        {s === 2 && (
          <div className="mt-4 space-y-3">
            <label className="block text-sm">{T('name')}<input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label className="block text-sm">{T('phone')}<input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="5xx xx xx xx" /></label>
            <label className="block text-sm">{T('email_opt')}<input className={field} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
            <div className="flex gap-2 text-sm">
              {[false, true].map((x) => (
                <button key={String(x)} onClick={() => setAcc(x)} aria-pressed={acc === x}
                  className={`flex-1 rounded-lg border px-3 py-2 ${acc === x ? 'border-brand bg-tint font-semibold' : 'border-ink/20'}`}>{T(x ? 'account' : 'guest')}</button>
              ))}
            </div>
            {err && <p role="alert" className="text-sm text-[#b42318]">{T('err')}</p>}
          </div>
        )}
        {s === 3 && (
          <dl className="mt-4 space-y-1 text-sm">
            <div><dt className="inline text-ink/70">{T('name')}: </dt><dd className="inline font-medium">{name}</dd></div>
            <div><dt className="inline text-ink/70">{T('phone')}: </dt><dd className="inline font-medium">{phone}</dd></div>
            <div className="pt-2 text-xs text-ink/70">{T('no_fee')}</div>
          </dl>
        )}
        <div className="mt-5 flex gap-3">
          {s > 1 && <button className="rounded-lg border border-ink/25 px-5 py-3" onClick={() => setS(s - 1)}>{T('back')}</button>}
          <button className={btn + ' flex-1'} onClick={s === 3 ? onDone : next}>{T(s === 3 ? 'confirm' : 'next')}</button>
        </div>
      </div>
    </div>
  )
}

function Done({ c, v }: { c: Ctx; v: { id: number; day: number; hour: number } }) {
  const { l, T, go } = c
  const d = DOCS.find((x) => x.id === v.id)!
  const dt = new Date(Date.now() + v.day * 864e5); dt.setHours(v.hour, 0, 0, 0)
  const p = (n: number) => String(n).padStart(2, '0')
  const fmt = (x: Date) => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${d.en} (DocTime)\nDTSTART:${fmt(dt)}\nDTEND:${fmt(new Date(dt.getTime() + 36e5))}\nEND:VEVENT\nEND:VCALENDAR`
  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-free text-3xl text-white">✓</div>
      <h1 className="mt-4 text-2xl font-bold">{T('done_title')}</h1>
      <div className={card + ' mt-5 p-5 text-left'}>
        <div className="font-semibold">{d[l]} · {SPECS[d.spec][l]}</div>
        <div>{dayLabel(v.day, l)}, {v.hour}:00</div>
        <div className="mt-2 text-lg font-bold text-brand">{T('pay')}: {d.price} ₾</div>
      </div>
      <p className="mt-4">{T('done_note')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a className={btn} download="doctime-visit.ics" href={'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)}>{T('add_cal')}</a>
        <button className="rounded-lg border border-ink/25 px-5 py-3" onClick={() => go({ p: 'home' })}>{T('home')}</button>
      </div>
    </div>
  )
}

function Privacy({ c }: { c: Ctx }) {
  const { T } = c
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">{T('privacy_title')}</h1>
      {[1, 2, 3].map((n) => <p key={n} className="mt-4 text-lg leading-relaxed">{T('privacy_' + n)}</p>)}
    </div>
  )
}

export default function App() {
  const [l, setL] = useState<Lang>(() => {
    try { return (localStorage.getItem('lang') as Lang) || 'ka' } catch { return 'ka' }
  })
  const [v, setV] = useState<View>({ p: 'home' })
  const [booked, setBooked] = useState<Set<string>>(new Set())
  useEffect(() => {
    try { localStorage.setItem('lang', l) } catch { /* storage unavailable */ }
    document.documentElement.lang = l
  }, [l])
  const c: Ctx = { l, T: (k) => t(l, k), go: (x) => { setV(x); window.scrollTo(0, 0) }, booked }
  return (
    <div className="min-h-screen">
      <Header c={c} setL={setL} />
      <main>
        {v.p === 'home' && <Home c={c} />}
        {v.p === 'docs' && <Docs key={`${v.q}|${v.spec}`} c={c} init={v} />}
        {v.p === 'doc' && <Profile key={v.id} c={c} id={v.id} />}
        {v.p === 'book' && <Booking c={c} v={v} onDone={() => {
          setBooked(new Set(booked).add(`${v.id}-${v.day}-${v.hour}`)); c.go({ p: 'done', id: v.id, day: v.day, hour: v.hour })
        }} />}
        {v.p === 'done' && <Done c={c} v={v} />}
        {v.p === 'privacy' && <Privacy c={c} />}
      </main>
      <Footer c={c} />
    </div>
  )
}
