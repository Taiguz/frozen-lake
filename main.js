const { app, BrowserWindow } = require('electron')
const path = require('path')
function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.resolve(__dirname, 'assets', 'icon.png')
    })

    win.setMenu(null)
    win.loadFile(path.resolve(__dirname, 'pages', 'index.html'))

}

app.whenReady().then(createWindow)


app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

