import fs, { createReadStream, existsSync } from 'fs-extra'
import { FILE_LOCATION } from './constants'

WebApp.connectHandlers.use('/images', (req, res, next) => {
  const storagePath = FILE_LOCATION
  // 폴더 정보를 담음
  // EX) http://localhost:3000/images/202145/reter.jpg
  // 위에서 202145가 [2]임
  const storageFolder = req.originalUrl.split('/')[2]
  const filename = req.originalUrl.split('/')[3] // 위에서처럼 파일 이름을 담음

  const fullFilePath = `${storagePath}/${storageFolder}/${filename}`

  // 만약 경로에 파일이없으면..
  if (!existsSync(fullFilePath)) {
    // res.writeHead(400);
    // res.end();
    // return;

    const noFilePath = `${storagePath}/noImage.jpg`
    const noFile = createReadStream(noFilePath)

    res.writeHead(200)

    noFile
      .on('data', (chunk) => {
        console.log(`chunk size: ${chunk.length}`)
      })
      .pipe(res)
      .on('finish', () => {
        console.log('read file finish')
      })
    return
  }

  const file = createReadStream(fullFilePath)

  res.writeHead(200)

  file
    .on('data', (chunk) => {
      console.log(`chunk size : ${chunk.length}`)
    })
    .pipe(res)
    .on('end', () => {
      console.log('read file finish')
    })
})
