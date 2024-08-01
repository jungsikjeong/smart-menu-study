import fs, { createWriteStream } from 'fs-extra'
import shortid from 'shortid'
import { FILE_LOCATION } from '/imports/utils/constants'

const getFilePath = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  const uploadFolderName = `/${String(year)}${String(month)}${String(day)}/`
  const uploadFolder = FILE_LOCATION + uploadFolderName

  try {
    // 폴더가있는지 확인
    fs.statSync(uploadFolder)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 폴더가 없으면 폴더 생성
      fs.mkdirSync(uploadFolder, (error) => {
        if (error) throw error
      })
    }
  }

  // 최종적으로 로컬경로와 폴더이름을 pathInfo에 넣어 리턴
  const pathInfo = {
    makeFolder: uploadFolderName,
    uploadFolder: uploadFolder,
  }

  return pathInfo
}

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype, encoding } = await upload
  const stream = createReadStream() // 읽기전용 스크림생성

  const ext = filename.substring(filename.indexOf('.') + 1) // 파일 확장자 구해두기
  const id = shortid.generate() // 파일명 중복방지위해 id랜던 값 생성

  const pathInfo = await getFilePath()
  const path = pathInfo.uploadFolder
  const newFile = `${path}${id}.${ext}`
  const newFileName = `${id}.${ext}`

  const fileName = newFileName
  const filePath = pathInfo.makeFolder
  const fileType = mimetype

  let filesize = 0
  const maxFileSize = 10000000

  const checkExt = new RegExp('(bmp|gif|jpg|jpeg|png)', 'i')
  if (!checkExt.test(ext)) throw '업로드 할 수 없는 파일 형식입니다. '

  return new Promise((resolve, reject) => {
    stream
      .on('data', function (chunk) {
        console.log(`chunk: ${chunk.length}`)
        filesize += chunk.length
        if (filesize > maxFileSize) {
          stream.destroy() // 현재 진행중인 스트림 취소
          fs.remove(newFile) // 현재까지 올라간 파일 지우기
          reject('over file size') // 오류 메시지담아서 종료
        }
      })
      .pipe(createWriteStream(newFile))
      .on('finish', () => {
        console.log('finish')
        return resolve({ fileName, filePath, fileType })
      })
      .on('error', reject)
  })
}

export default processUpload
