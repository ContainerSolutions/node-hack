## Vulnerable nodejs app for demos

**WARNING**: *This app deliberately exposes a RCE vulnerability (CVE-2013-4660). It is meant to demonstrate the use of Docker to clean up after a breach and prevent them from happening again in the future.*

#### Build & run:

    $ docker build -t node-hack .
    $ docker run -it --rm -p 1337:1337 --name node-hack node-hack

#### Browse to and demo app:
With docker-machine on OS X

    $ open http://$(docker-machine ip default):1337

- Upload `yaml/nice.yml`, `yaml/broken.yml` and `yaml/evil.yml` for demonstration.
- Browse to start page to see defaced website.
- `Ctrl+c` & re-run container to show the breach casued by `evil.yml` is gone again.

#### Run in read only mode:
To prevent more breaches...

    $ docker run --read-only -it --rm -p 1337:1337 --name node-hack node-hack

Try to upload `evil.yml` again => no breach.

#### Poor mans kill & supervisor scripts:
Use this if you want to demo cases where you can't use `--read-only` (the "supervisor" loop is needed as `--restart=always` does not work with `--rm`)

    $ while :; do test $(docker diff node-hack | wc -l) -gt 0 && docker kill node-hack; sleep 3; done
    # in a different terminal:
    $ while :; do docker run -it --rm -p 1337:1337 --name node-hack node-hack; sleep 2; done

Upload `evil.yml` again => breach is undone after a few seconds.
