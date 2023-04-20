import pywebpush
import sys
import json

# input format (via stdin)
# {
#     "subscriptions": [
#         {
#             "endpoint": "https://updates.push.services.mozilla.com/push/v1/gAA...",
#             "keys": { "auth": "k8J...", "p256dh": "BOr..." }
#         }
#     ],
#     "payload": {
#         "literally": "anything"
#     },
#     "vapid_private_key": "...",
#     "vapid_claims": {
#         "sub": "mailto:admin@example.com"
#     }
# }

data = json.load(sys.stdin)

resp = []

for subscription in data['subscriptions']:
    try:
        pywebpush.webpush(subscription, data=json.dumps(data['payload']), vapid_private_key=data['vapid_private_key'], vapid_claims=data['vapid_claims'])
        resp.append({
            "subscription": subscription,
            "success": True,
        })
    except pywebpush.WebPushException as e:
        error = e.response.json()
        resp.append({
            "subscription": subscription,
            "success": False,
            "error": error,
        })

print(json.dumps(resp))
