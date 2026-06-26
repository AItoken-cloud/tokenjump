import fs from 'node:fs/promises'
import path from 'node:path'

const LOCALES_DIR = path.resolve('src/i18n/locales')

function stableStringify(obj) {
  return JSON.stringify(obj, null, 2) + '\n'
}

const newKeys = {
  en: {
    'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0':
      'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0',
    'Content array containing type, text, role, first_frame, and last_frame fields.':
      'Content array containing type, text, role, first_frame, and last_frame fields.',
    'URL of the first frame image for video generation.':
      'URL of the first frame image for video generation.',
    'URL of the last frame image for video generation.':
      'URL of the last frame image for video generation.',
  },
  zh: {
    'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0':
      '模型名称：Doubao-seedance-1.0-pro-250528、Doubao-Seedance-2.0',
    'Content array containing type, text, role, first_frame, and last_frame fields.':
      '内容数组，包含type、text、role、first_frame和last_frame字段。',
    'URL of the first frame image for video generation.':
      '首帧图片的URL，用于视频生成。',
    'URL of the last frame image for video generation.':
      '尾帧图片的URL，用于视频生成。',
  },
  fr: {
    'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0':
      'Nom du modèle : Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0',
    'Content array containing type, text, role, first_frame, and last_frame fields.':
      'Tableau de contenu contenant les champs type, text, role, first_frame et last_frame.',
    'URL of the first frame image for video generation.':
      'URL de l\'image de la première frame pour la génération vidéo.',
    'URL of the last frame image for video generation.':
      'URL de l\'image de la dernière frame pour la génération vidéo.',
  },
  ja: {
    'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0':
      'モデル名：Doubao-seedance-1.0-pro-250528、Doubao-Seedance-2.0',
    'Content array containing type, text, role, first_frame, and last_frame fields.':
      'type、text、role、first_frame、last_frameフィールドを含むコンテンツ配列。',
    'URL of the first frame image for video generation.':
      '動画生成用の先頭フレーム画像のURL。',
    'URL of the last frame image for video generation.':
      '動画生成用の末尾フレーム画像のURL。',
  },
  ru: {
    'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0':
      'Название модели: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0',
    'Content array containing type, text, role, first_frame, and last_frame fields.':
      'Массив содержимого, содержащий поля type, text, role, first_frame и last_frame.',
    'URL of the first frame image for video generation.':
      'URL изображения первого кадра для генерации видео.',
    'URL of the last frame image for video generation.':
      'URL изображения последнего кадра для генерации видео.',
  },
  vi: {
    'Model name: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0':
      'Tên mô hình: Doubao-seedance-1.0-pro-250528, Doubao-Seedance-2.0',
    'Content array containing type, text, role, first_frame, and last_frame fields.':
      'Mảng nội dung chứa các trường type, text, role, first_frame và last_frame.',
    'URL of the first frame image for video generation.':
      'URL của hình ảnh khung đầu tiên để tạo video.',
    'URL of the last frame image for video generation.':
      'URL của hình ảnh khung cuối cùng để tạo video.',
  },
}

async function main() {
  let totalAdded = 0

  for (const [locale, trans] of Object.entries(newKeys)) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`)
    const json = JSON.parse(await fs.readFile(filePath, 'utf8'))

    let count = 0
    for (const [key, value] of Object.entries(trans)) {
      if (!Object.prototype.hasOwnProperty.call(json.translation, key)) {
        json.translation[key] = value
        count++
      } else if (json.translation[key] !== value) {
        json.translation[key] = value
        count++
      }
    }

    if (count > 0) {
      json.translation = Object.fromEntries(
        Object.entries(json.translation).sort(([a], [b]) => a.localeCompare(b))
      )
      await fs.writeFile(filePath, stableStringify(json), 'utf8')
    }

    console.log(`${locale}: ${count} translations applied`)
    totalAdded += count
  }

  console.log(`\nTotal: ${totalAdded} translations applied`)
}

main().catch((err) => { console.error(err); process.exitCode = 1 })
