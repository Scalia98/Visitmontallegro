import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = CAPBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)

        // Visit Montallegro: app aperta da chiusa con una scorciatoia dell'icona (pressione prolungata)
        if let shortcutItem = connectionOptions.shortcutItem {
            QuickActions.deliverWhenReady(shortcutItem)
        }
    }

    // Visit Montallegro: scorciatoia scelta con l'app già in background
    func windowScene(_ windowScene: UIWindowScene, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {
        completionHandler(QuickActions.open(shortcutItem))
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

/// Scorciatoie dell'icona (Spiagge, Visit Torre Salsa, Visit) definite in Info.plist.
/// Ogni scorciatoia ha un link montallegroinfoapp:// che l'app web riceve dall'evento appUrlOpen di @capacitor/app.
enum QuickActions {
    static func url(for item: UIApplicationShortcutItem) -> URL? {
        guard let value = item.userInfo?["url"] as? String else { return nil }
        return URL(string: value)
    }

    @discardableResult
    static func open(_ item: UIApplicationShortcutItem) -> Bool {
        guard let url = url(for: item) else { return false }
        return ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
    }

    /// All'avvio a freddo i plugin non sono ancora pronti: si aspetta che la vista Capacitor sia comparsa.
    static func deliverWhenReady(_ item: UIApplicationShortcutItem) {
        var token: NSObjectProtocol?
        token = NotificationCenter.default.addObserver(forName: .capacitorViewDidAppear, object: nil, queue: .main) { _ in
            if let token {
                NotificationCenter.default.removeObserver(token)
            }
            QuickActions.open(item)
        }
    }
}
