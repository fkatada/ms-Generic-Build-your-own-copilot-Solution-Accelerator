import { Action, AppState } from './AppProvider'

// Define the reducer function
export const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'TOGGLE_CHAT_HISTORY':
      return { ...state, isChatHistoryOpen: !state.isChatHistoryOpen }
    case 'UPDATE_CURRENT_CHAT':
      return { ...state, currentChat: action.payload, isLoading: false }
    case 'UPDATE_CHAT_HISTORY_LOADING_STATE':
      return { ...state, chatHistoryLoadingState: action.payload }
    case 'UPDATE_CHAT_HISTORY':
      if (!state.chatHistory || !state.currentChat) {
        return state
      }
      const conversationIndex = state.chatHistory.findIndex(conv => conv.id === action.payload.id)
      if (conversationIndex !== -1) {
        const updatedChatHistory = [...state.chatHistory]
        updatedChatHistory[conversationIndex] = state.currentChat
        return { ...state, chatHistory: updatedChatHistory }
      } else {
        return { ...state, chatHistory: [...state.chatHistory, action.payload] }
      }
    case 'UPDATE_CHAT_TITLE':
      if (!state.chatHistory) {
        return { ...state, chatHistory: [] }
      }
      const updatedChats = state.chatHistory.map(chat => {
        if (chat.id === action.payload.id) {
          if (state.currentChat?.id === action.payload.id) {
            state.currentChat.title = action.payload.title
          }
          //TODO: make api call to save new title to DB
          return { ...chat, title: action.payload.title }
        }
        return chat
      })
      return { ...state, chatHistory: updatedChats }
    case 'DELETE_CHAT_ENTRY':
      if (!state.chatHistory) {
        return { ...state, chatHistory: [] }
      }
      const filteredChat = state.chatHistory.filter(chat => chat.id !== action.payload)
      state.currentChat = null
      //TODO: make api call to delete conversation from DB
      return { ...state, chatHistory: filteredChat }
    case 'DELETE_CHAT_HISTORY':
      //TODO: make api call to delete all conversations from DB
      return { ...state, chatHistory: [], filteredChatHistory: [], currentChat: null }
    case 'DELETE_CURRENT_CHAT_MESSAGES':
      //TODO: make api call to delete current conversation messages from DB
      if (!state.currentChat || !state.chatHistory) {
        return state
      }
      const updatedCurrentChat = {
        ...state.currentChat,
        messages: []
      }
      return {
        ...state,
        currentChat: updatedCurrentChat
      }
    case 'FETCH_CHAT_HISTORY':
      return { ...state, chatHistory: action.payload }
    case 'SET_COSMOSDB_STATUS':
      return { ...state, isCosmosDBAvailable: action.payload }
    case 'FETCH_FRONTEND_SETTINGS':
      return { ...state, frontendSettings: action.payload }
    case 'SET_FEEDBACK_STATE':
      return {
        ...state,
        feedbackState: {
          ...state.feedbackState,
          [action.payload.answerId]: action.payload.feedback
        }
      }
    case 'UPDATE_SECTION':
      const sectionIdx = action.payload.sectionIdx

      if (!state.draftedDocument?.sections || sectionIdx >= state.draftedDocument.sections.length) {
        console.error('Section not found')
        return state
      }

      // create new sections list
      const updatedSections = [...state.draftedDocument.sections]
      updatedSections[sectionIdx] = action.payload.section

      return {
        ...state,
        draftedDocument: {
          ...state.draftedDocument,
          sections: updatedSections
        }
      }
    case 'UPDATE_DRAFTED_DOCUMENT':
      return { ...state, draftedDocument: action.payload }
    case 'UPDATE_BROWSE_CHAT':
      return { ...state, browseChat: action.payload }
    case 'UPDATE_GENERATE_CHAT':
      return { ...state, generateChat: action.payload }
    case 'UPDATE_DRAFTED_DOCUMENT_TITLE':
      return { ...state, draftedDocumentTitle: action.payload }
    case 'GENERATE_ISLODING':
      return { ...state, isGenerating: action.payload }
      case 'SET_IS_REQUEST_INITIATED' : 
      return {...state, isRequestInitiated : action.payload}
    case 'ADD_FAILED_SECTION':
       var tempFailedSections = [...state.failedSections];
       const exists = tempFailedSections.some((item) => item.title === action.payload.title);
       if (!exists) 
        tempFailedSections.push(action.payload);
        return { ...state , failedSections : [...tempFailedSections]  }
     case 'REMOVED_FAILED_SECTION' : 
      var tempFailedSections = [...state.failedSections];
      tempFailedSections = state.failedSections.filter((item) => item.title !== action.payload.section.title);
      return { ...state , failedSections : [...tempFailedSections] }
    case 'UPDATE_SECTION_API_REQ_STATUS' : 
      return {...state, isFailedReqInitiated : action.payload}

    default:
      return state
  }
}
