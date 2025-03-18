import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import authSlice from './slice/authSlice';
import smsDutySlice from './slice/smsDutySlice'; 
import rollingDutySlice from './slice/rollingDutySlice'; 
import masterSlice from './slice/masterSlice';
const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	whitelist: ['auth', 'smsDuty', 'rollingDuty', 'masters'],
};

const rootReducer = combineReducers({
  auth: authSlice,
  smsDuty: smsDutySlice,
  rollingDuty: rollingDutySlice,
  masters: masterSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false })

});

export const persistor = persistStore(store);
export default store;