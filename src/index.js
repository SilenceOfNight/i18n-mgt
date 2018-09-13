import dva from 'dva'
import './index.css'

// 1. Initialize
const app = dva({
  initialState: {
    resources: {
      current: 'translation',
      namespaces: {
        translation: [
          {
            key: 'model.confernece.subject.label',
            en: 'Subject',
            zh: '主题'
          }
        ],
        error: []
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
