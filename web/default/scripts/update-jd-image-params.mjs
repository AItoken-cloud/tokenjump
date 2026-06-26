import fs from 'node:fs/promises'
import path from 'node:path'

const LOCALES_DIR = path.resolve('src/i18n/locales')

function stableStringify(obj) {
  return JSON.stringify(obj, null, 2) + '\n'
}

const oldKey = 'Content array containing type, text, role, first_frame, and last_frame fields.'
const newKey = 'Content array containing type, text, role, first_frame, and last_frame fields. type: string, content type (text: positive text prompt, required). text: string, prompt text. role: string, first/last frame identifier. first_frame: first frame image. last_frame: last frame image.'

const translations = {
  zh: '内容数组，包含type、text、role、first_frame和last_frame字段。type: string，内容类型（text:正向文本提示词，必选）。text: string，提示词文本。role: string，首尾帧标识。first_frame: 首帧图片。last_frame: 尾帧图片。',
  fr: 'Tableau de contenu contenant les champs type, text, role, first_frame et last_frame. type: string, type de contenu (text: invite textuelle positive, obligatoire). text: string, texte de l\'invite. role: string, identifiant de première/dernière frame. first_frame: image de la première frame. last_frame: image de la dernière frame.',
  ja: 'type、text、role、first_frame、last_frameフィールドを含むコンテンツ配列。type: string、コンテンツタイプ（text:ポジティブテキストプロンプト、必須）。text: string、プロンプトテキスト。role: string、先頭/末尾フレーム識別子。first_frame: 先頭フレーム画像。last_frame: 末尾フレーム画像。',
  ru: 'Массив содержимого, содержащий поля type, text, role, first_frame и last_frame. type: string, тип содержимого (text: положительный текстовый запрос, обязательно). text: string, текст запроса. role: string, идентификатор первого/последнего кадра. first_frame: изображение первого кадра. last_frame: изображение последнего кадра.',
  vi: 'Mảng nội dung chứa các trường type, text, role, first_frame và last_frame. type: string, loại nội dung (text: lời nhắc văn bản tích cực, bắt buộc). text: string, văn bản lời nhắc. role: string, định danh khung đầu/cuối. first_frame: hình ảnh khung đầu tiên. last_frame: hình ảnh khung cuối cùng.',
}

async function main() {
  for (const locale of ['en', ...Object.keys(translations)]) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`)
    const json = JSON.parse(await fs.readFile(filePath, 'utf8'))

    // Remove old key if exists
    if (json.translation[oldKey] !== undefined) {
      delete json.translation[oldKey]
    }

    // Add new key
    const value = locale === 'en' ? newKey : translations[locale]
    json.translation[newKey] = value

    json.translation = Object.fromEntries(
      Object.entries(json.translation).sort(([a], [b]) => a.localeCompare(b))
    )
    await fs.writeFile(filePath, stableStringify(json), 'utf8')
    console.log(`${locale}: updated`)
  }
}

main().catch((err) => { console.error(err); process.exitCode = 1 })
