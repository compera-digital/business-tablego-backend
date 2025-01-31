import App from "./App";

(async () => {
  try {
    await App.start();
  } catch (error) {
    console.error("❌ Application failed to start", error);
    process.exit(1); // Uygulama başlatılamazsa çıkış yap
  }
})();
