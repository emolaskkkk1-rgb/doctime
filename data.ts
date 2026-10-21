import type { Lang } from './i18n'

export const SPECS: Record<string, Record<Lang, string>> = {
  therapist: { ka: 'თერაპევტი', en: 'Therapist' },
  cardiologist: { ka: 'კარდიოლოგი', en: 'Cardiologist' },
  dermatologist: { ka: 'დერმატოლოგი', en: 'Dermatologist' },
  ent: { ka: 'ყელ-ყურ-ცხვირის ექიმი', en: 'ENT' },
  pediatrician: { ka: 'პედიატრი', en: 'Pediatrician' },
  dentist: { ka: 'სტომატოლოგი', en: 'Dentist' },
}
export const DISTRICTS: Record<string, Record<Lang, string>> = {
  vake: { ka: 'ვაკე', en: 'Vake' }, saburtalo: { ka: 'საბურთალო', en: 'Saburtalo' },
  vera: { ka: 'ვერა', en: 'Vera' }, isani: { ka: 'ისანი', en: 'Isani' },
  didube: { ka: 'დიდუბე', en: 'Didube' }, gldani: { ka: 'გლდანი', en: 'Gldani' },
}
export const INS = ['Aldagi', 'Ardi', 'GPI']

export type Doc = {
  id: number; ka: string; en: string; spec: string; years: number; price: number
  rating: number; count: number; dist: string; ins: string[]; video: boolean
}
const A = 'Aldagi', R = 'Ardi', G = 'GPI'
// id, ka, en, spec, years, price, rating, count, district, insurance, video
const rows: [number, string, string, string, number, number, number, number, string, string[], boolean][] = [
  [1, 'ნინო კვარაცხელია', 'Nino Kvaratskhelia', 'therapist', 12, 70, 4.8, 124, 'vake', [A, R], true],
  [2, 'გიორგი ბერიძე', 'Giorgi Beridze', 'cardiologist', 18, 140, 4.9, 210, 'saburtalo', [A], true],
  [3, 'მარიამ ჯაფარიძე', 'Mariam Japaridze', 'dermatologist', 9, 90, 4.7, 96, 'vera', [R, G], false],
  [4, 'დავით მაისურაძე', 'Davit Maisuradze', 'ent', 15, 100, 4.6, 87, 'isani', [A, G], false],
  [5, 'ანა ლომიძე', 'Ana Lomidze', 'pediatrician', 11, 80, 4.9, 175, 'vake', [A, R, G], true],
  [6, 'ლევან გელაშვილი', 'Levan Gelashvili', 'dentist', 14, 120, 4.8, 143, 'saburtalo', [R], false],
  [7, 'თამარ წერეთელი', 'Tamar Tsereteli', 'therapist', 20, 65, 4.5, 61, 'didube', [G], true],
  [8, 'ნიკა ხარაიშვილი', 'Nika Kharaishvili', 'cardiologist', 8, 110, 4.4, 38, 'gldani', [R], false],
  [9, 'სალომე მგელაძე', 'Salome Mgeladze', 'dermatologist', 16, 150, 4.9, 188, 'vake', [A, R], true],
  [10, 'ირაკლი ჭანტურია', 'Irakli Chanturia', 'ent', 22, 130, 4.7, 119, 'vera', [A], false],
  [11, 'ლიკა ბაქრაძე', 'Lika Bakradze', 'pediatrician', 7, 60, 4.6, 72, 'isani', [R, G], true],
  [12, 'ზურაბ კაპანაძე', 'Zurab Kapanadze', 'dentist', 10, 95, 4.5, 54, 'didube', [A, G], false],
]
export const DOCS: Doc[] = rows.map(([id, ka, en, spec, years, price, rating, count, dist, ins, video]) => ({
  id, ka, en, spec, years, price, rating, count, dist, ins, video,
}))

const REV = [
  { a: { ka: 'ნინო', en: 'Nino' }, s: 5, ka: 'ძალიან ყურადღებიანი ექიმია, ყველაფერი დეტალურად ამიხსნა.', en: 'Very attentive doctor, explained everything in detail.' },
  { a: { ka: 'გიო', en: 'Gio' }, s: 5, ka: 'ფასი ზუსტად ის იყო, რაც საიტზე ეწერა. დიდხანს არ მელოდა.', en: 'The price was exactly what the site said. No long wait.' },
  { a: { ka: 'მარი', en: 'Mari' }, s: 4, ka: 'კარგი სპეციალისტია, ვიზიტი სწრაფად და მშვიდად ჩატარდა.', en: 'Good specialist, the visit was quick and calm.' },
  { a: { ka: 'დათო', en: 'Dato' }, s: 5, ka: 'ახლობლებსაც ვურჩევ.', en: 'I recommend to friends and family.' },
  { a: { ka: 'ანი', en: 'Ani' }, s: 4, ka: 'ცოტა დაგვიანდა, მაგრამ მკურნალობა დამეხმარა.', en: 'Slightly late, but the treatment helped.' },
]
export const reviewsFor = (id: number) => [0, 1, 2].map((i) => REV[(id + i) % 5])

export const HOURS = [10, 11, 12, 13, 14, 15, 16, 17]
export const isBusy = (id: number, day: number, hour: number, booked: Set<string>) => {
  if (booked.has(`${id}-${day}-${hour}`)) return true
  if (day === 0 && hour <= new Date().getHours()) return true
  return (id * 5 + day * 3 + hour) % 3 === 0
}
export const nextFree = (id: number, booked: Set<string>) => {
  for (let day = 0; day < 14; day++)
    for (const hour of HOURS) if (!isBusy(id, day, hour, booked)) return { day, hour }
  return null
}
export const dayLabel = (day: number, l: Lang) =>
  new Date(Date.now() + day * 864e5).toLocaleDateString(l === 'ka' ? 'ka-GE' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
