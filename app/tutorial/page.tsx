import Link from "next/link"
import { Pickaxe, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Pickaxe className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">mctools</h1>
              <p className="text-xs text-muted-foreground">Minecraft Mod Database</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to mods
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">How to Install Minecraft Mods</h1>

        <div className="space-y-10">
          {/* Step 1 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 1: Download and Install Fabric Loader</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Fabric is a lightweight mod loader for Minecraft. You need to install it before you can use most mods.
              </p>
              <p>
                Go to the official Fabric website at fabricmc.net and download the Fabric Installer. Run the installer and select your Minecraft version. Make sure the install location points to your Minecraft directory. Click Install and wait for the process to complete.
              </p>
              <p>
                Once installed, open the Minecraft Launcher. You should see a new profile called &quot;fabric-loader&quot; in the version dropdown. Select it and launch the game once to generate the necessary folders, then close Minecraft.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 2: Locate Your Mods Folder</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                After running Fabric at least once, a mods folder will be created in your Minecraft directory.
              </p>
              <p>
                On Windows, your Minecraft folder is typically located at C:\Users\YourUsername\AppData\Roaming\.minecraft. You can also access it by pressing Win+R, typing %appdata%, and navigating to the .minecraft folder.
              </p>
              <p>
                On macOS, the folder is at ~/Library/Application Support/minecraft. You can access it by opening Finder, clicking Go in the menu bar, selecting Go to Folder, and typing the path.
              </p>
              <p>
                On Linux, the folder is usually at ~/.minecraft in your home directory.
              </p>
              <p>
                Inside your .minecraft folder, look for a folder named mods. If it does not exist, create it manually.
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 3: Download Your Mods</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Browse the mod library on our homepage and find the mods you want to install. Click the Download button on any mod card to download the .jar file directly.
              </p>
              <p>
                Make sure to download mods that are compatible with your Minecraft version and mod loader. Most mods on this site are designed for Fabric, but some may require Forge instead. Check the mod description for compatibility information.
              </p>
              <p>
                Some mods require additional library mods to function. For example, many Fabric mods require the Fabric API mod. Make sure to read the mod requirements and download any dependencies.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 4: Install the Mods</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Once you have downloaded your mod .jar files, simply move or copy them into the mods folder you located in Step 2.
              </p>
              <p>
                Do not extract or unzip the .jar files. They should remain as .jar files in the mods folder. If you downloaded a .zip file, check if the actual .jar file is inside and extract only the .jar file.
              </p>
              <p>
                You can install multiple mods at once by placing all their .jar files in the mods folder. However, be aware that some mods may conflict with each other.
              </p>
            </div>
          </section>

          {/* Step 5 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 5: Launch the Game</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Open the Minecraft Launcher and make sure you have the Fabric profile selected. Click Play to launch Minecraft with your mods installed.
              </p>
              <p>
                On the main menu, you should see a Mods button if you have installed the Mod Menu mod. Click it to see a list of all installed mods and their settings.
              </p>
              <p>
                If the game crashes or mods are not loading, check that all mods are compatible with your Minecraft version and each other. Remove mods one by one to identify any conflicts.
              </p>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Tips and Troubleshooting</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Always back up your worlds before installing new mods. Mods can sometimes corrupt world data, especially when updating or removing them.
              </p>
              <p>
                Keep your mods organized by only installing what you need. Too many mods can cause performance issues and increase the chance of conflicts.
              </p>
              <p>
                If a mod is not working, make sure you have installed all required dependencies. Check the mod page for a list of required libraries.
              </p>
              <p>
                When updating Minecraft, you may need to wait for mod updates. Do not try to use mods made for different Minecraft versions.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Pickaxe className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">mctools</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Not affiliated with Mojang or Microsoft.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
