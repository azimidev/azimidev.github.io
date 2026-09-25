## About azimi.dev
azimi.dev is created for personal use from scratch with the help of jQuery and Tailwind CSS (via the Play CDN).

## Two versions, one homepage
| Path | What |
|---|---|
| `v1/index.html` | Classic: the black title blocks |
| `v2/index.html` | "Thinks outside the box": the overflowing CSS box |
| `index.html` | **Generated.** A copy of whichever version is live |

Pick the homepage:
```sh
./switch.sh v1   # or v2
./switch.sh      # shows which one is live
```
Always edit `v1/` or `v2/`, then re-run `./switch.sh` for the live one.
Both versions stay reachable at `/v1/` and `/v2/` (`noindex`, canonical to `/`), so switching never breaks a link or splits SEO.

## Run locally
```sh
python3 -m http.server 8765
# open http://localhost:8765
```

## Licence
Nobody is allowed to use this project or its idea for any purpose.
