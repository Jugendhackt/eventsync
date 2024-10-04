{
  description = "Dev Environment for JugendFinder, installs dependencies automatically.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {

    # Define the development environment
    devShells.default = nixpkgs.lib.mkShell {
      
      # Define the packages you want in the environment
      buildInputs = [
        # Python and dependencies
        (nixpkgs.python310.withPackages (ps: with ps; [
          aiosqlite
        ]))

        # Bun package manager
        nixpkgs.bun
      ];

      # You can set environment variables, if needed
      shellHook = ''
        echo "Welcome to the development environment!"
      '';
    };
  };
}
