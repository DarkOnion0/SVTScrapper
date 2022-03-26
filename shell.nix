{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    shellHook = ''
        # install yarn dependencies
        yarn install

        # patch playwright on nixos
        bash ./fix-playwright.sh

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
