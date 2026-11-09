import electron, { dialog, shell } from 'electron'
import fs from 'fs'

const BrowserWindow = electron.BrowserWindow

const options = {
  pageSize: 'A4',
  printBackground: true,
  landscape: false
} satisfies Electron.PrintToPDFOptions

export const handleOnPrint = async () => {
  let filePath = ''
  await dialog.showOpenDialog({ properties: ['openFile'] }).then(function (response) {
    if (!response.canceled) {
      filePath = response.filePaths[0]
      console.log(filePath)
    } else {
      console.log('no file selected')
    }
  })

  const win = BrowserWindow.getFocusedWindow()

  if (!win) return

  win.webContents
    .printToPDF(options)
    .then((data) => {
      fs.writeFile(filePath, data, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('PDF Generated Successfully')
          shell.openPath(filePath)
        }
      })
    })
    .catch((error) => {
      console.log(error)
    })
}
