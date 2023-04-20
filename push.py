import pywebpush
import sys
import json

# input format (via stdin)
# {
#     "subscription": {
#         "endpoint": "https://updates.push.services.mozilla.com/push/v1/gAA...",
#         "keys": { "auth": "k8J...", "p256dh": "BOr..." }
#     },
#     "payload": {
#         "literally": "anything"
#     },
#     "vapid_private_key": "...",
#     "vapid_claims": {
#         "sub": "mailto:admin@example.com"
#     }
# }

data = json.load(sys.stdin)

pywebpush.webpush(data['subscription'], data=json.dumps(data['payload']), vapid_private_key=data['vapid_private_key'], vapid_claims=data['vapid_claims'])
