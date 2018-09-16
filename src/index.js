import dva from 'dva'
import { createLogger } from 'redux-logger'
import './index.css'

// 1. Initialize
const app = dva({
  onAction: [createLogger()],
  initialState: {
    resources: {
      current: 'translation',
      condition: null,
      filter: 'all',
      namespaces: {
        translation: {
          defaultLanguage: 'zh',
          languages: {
            zh: '中文',
            en: '英文'
          },
          resources: {}
        }
      }
    }
  }
})

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/resources').default)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
