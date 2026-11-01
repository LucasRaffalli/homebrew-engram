cask "charon" do
  version "1.3.0"
  sha256 "ef223bdf7134554664f0a72f560aa4c8b7b1605acb4e767ff3440372d41145ca"

  url "https://release.lucasraffalli.com/charon/Charon_#{version}_aarch64.dmg"
  name "Charon"
  desc "Client SFTP/FTPS/FTP privé pour macOS"
  homepage "https://app.lucasraffalli.com/charon"

  # L'app embarque son propre updater : brew upgrade n'a rien à faire.
  auto_updates true
  depends_on arch: :arm64

  app "Charon.app"

  # App non notarisée : sans ça, Gatekeeper affiche « charon est endommagé ».
  postflight do
    system_command "/usr/bin/xattr",
                   args: ["-cr", "#{appdir}/Charon.app"]
  end

  uninstall quit: "com.aegis.charon"

  zap trash: [
    "~/Library/Application Support/com.aegis.charon",
    "~/Library/Caches/com.aegis.charon",
    "~/Library/Preferences/com.aegis.charon.plist",
    "~/Library/Saved Application State/com.aegis.charon.savedState",
    "~/Library/WebKit/com.aegis.charon",
  ]
end
