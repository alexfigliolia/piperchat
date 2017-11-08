App.appendToConfig(`<platform name="ios">
<config-file platform="ios" target="*-Info.plist" parent="NSPhotoLibraryUsageDescription">
    <string>We do not need to access your library</string>
</config-file>
<config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
    <string>Your camera will be used for video chat!</string>
</config-file>
<config-file parent="UIStatusBarHidden" platform="ios" target="*-Info.plist">
    <true/>
    </config-file>
    <config-file parent="UIViewControllerBasedStatusBarAppearance" platform="ios" target="*-Info.plist">
    <false/>
 </config-file>
</platform>`);