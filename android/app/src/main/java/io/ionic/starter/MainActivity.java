package io.ionic.starter;

import android.os.Build;
import android.os.Handler;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  public boolean hasWebViewBeenReloaded = false;

  protected static final int requiredDecorViewFlags =  View.SYSTEM_UI_FLAG_LAYOUT_STABLE
      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
      | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
      | View.SYSTEM_UI_FLAG_FULLSCREEN
      | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);

    if (hasFocus && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      View decorView = getWindow().getDecorView();
      decorView.setSystemUiVisibility(requiredDecorViewFlags);

      // Web view needs to be reloaded cuz android doesn't catch the env(safe inset area) variables at first load
      if (!hasWebViewBeenReloaded) {
        WebView webView = ((Bridge) bridge).getWebView();
        webView.reload();
        hasWebViewBeenReloaded = true;
      }
    }
  }

  protected void listenToUiVisibilityChange() {
    Window window = getWindow();
    if (window == null) {
      return;
    }
    final View view = window.getDecorView();
    if (view == null) {
      return;
    }
    view.setOnSystemUiVisibilityChangeListener(
      new View.OnSystemUiVisibilityChangeListener() {
        @Override
        public void onSystemUiVisibilityChange(int visibility) {
          Handler handler = new Handler(
            getMainLooper()
          );
          handler.postDelayed(
            new Runnable() {
              @Override
              public void run() {
                Window activityWindow = getWindow();
                if (activityWindow == null) {
                  return;
                }
                View decorView = activityWindow.getDecorView();
                if (decorView == null) {
                  return;
                }
                decorView.setSystemUiVisibility(requiredDecorViewFlags);
              }
            },
            1000
          );
        }
      }
    );
  }

  @Override
  public void onResume() {
    super.onResume();
    listenToUiVisibilityChange();
  }
}
