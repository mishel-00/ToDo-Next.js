import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import globalReducer from "@/state";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";


/* 🔹 REDUX PERSISTENCE */
const createNoopStorage = () => ({
    getItem: () => Promise.resolve(null),
    setItem: (_: any, value: any) => Promise.resolve(value),
    removeItem: () => Promise.resolve(),
  });
  

const storage = typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

const PERSIST_CONFIG = {
  key: "root",
  storage,
  whitelist: ["global"],
};


const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer);

/* 🔹 STORE CONFIGURATION */
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }).concat(api.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

/* 🔹 TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector<RootState>;

/* 🔹 PROVIDER */
const store = makeStore(); 
const persistor = persistStore(store);

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
