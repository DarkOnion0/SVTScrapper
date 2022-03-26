{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    shellHook = ''
        # install yarn dependencies
        yarn install

        # patch playwright on nixos
        if [ -z $NIXPKGS_CONFIG ]; then
            echo no need to patch playwright
        else
            bash ./fix-playwright.sh
        fi

        # install playwright support for firefox
        yarn playwright install firefox
    '';

    # nativeBuildInputs is usually what you want -- tools you need to run
    nativeBuildInputs = [
      pkgs.yarn
      pkgs.firefox-bin
      pkgs.nodejs-16_x
     ];
}
