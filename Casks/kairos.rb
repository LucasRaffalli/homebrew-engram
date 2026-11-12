cask "kairos" do
  version "1.1.0"
  sha256 "8549deb2e45fdea2f1db308defe647858d13f7236169d200d4ff6ec8549ff29c"

  url "https://release.lucasraffalli.com/kairos/Kairos_#{version}_aarch64.dmg"
  name "Kairos"
  desc "Menu bar time tracker"
  homepage "https://github.com/LucasRaffalli/kairos"

  # L'app embarque son propre updater : brew upgrade n'a rien à faire.
  auto_updates true
  depends_on arch: :arm64
  depends_on :macos

  app "Kairos.app"
  # La commande kairos (CLI et serveur MCP, lancé par « kairos mcp ») vit dans l'app : le lien suit
  # donc ses mises à jour.
  binary "#{appdir}/Kairos.app/Contents/MacOS/kairos"

  # App non notarisée : sans ça, Gatekeeper affiche « Kairos est endommagé ».
  postflight_steps do
    run "/usr/bin/xattr", args: ["-cr", "{{appdir}}/Kairos.app"]
  end

  uninstall quit: "com.aegis.kairos"

  zap trash: [
    "~/Library/Application Support/com.aegis.kairos",
    "~/Library/Caches/com.aegis.kairos",
    "~/Library/Preferences/com.aegis.kairos.plist",
    "~/Library/Saved Application State/com.aegis.kairos.savedState",
    "~/Library/WebKit/com.aegis.kairos",
  ]
end
