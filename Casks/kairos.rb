cask "kairos" do
  version "0.2.0"
  sha256 "677b88ae9f744a0ce1b0011ab0759b5dc8f6c8334d4af25db60367f1966a5804"

  url "https://release.lucasraffalli.com/kairos/Kairos_#{version}_aarch64.dmg"
  name "Kairos"
  desc "Chronomètre de barre de menus pour Monday"
  homepage "https://github.com/LucasRaffalli/kairos"

  # L'app embarque son propre updater : brew upgrade n'a rien à faire.
  auto_updates true
  depends_on arch: :arm64

  app "Kairos.app"
  # La commande kairos (CLI et serveur MCP, lancé par « kairos mcp ») vit dans l'app : le lien suit
  # donc ses mises à jour.
  binary "#{appdir}/Kairos.app/Contents/MacOS/kairos"

  # App non notarisée : sans ça, Gatekeeper affiche « Kairos est endommagé ».
  postflight do
    system_command "/usr/bin/xattr",
                   args: ["-cr", "#{appdir}/Kairos.app"]
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
