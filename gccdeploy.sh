#!/bin/zsh

########################################
# CONFIG
########################################
PROJECT_ID="sdsanalyticsservice"
REGION="europe-west1"
REPO="frontend-repo"
SERVICE="analytics-frontend"
VERSION_FILE="./.version"
LOGFILE="./deploy.log"

# Carico variabili dal file .env
DATA_SERVICE_BASE_URL=$(grep "^DATA_SERVICE_BASE_URL=" .env | cut -d '=' -f2-)
TELEGRAM_CHAT_ID=$(grep "^NEXT_PUBLIC_TELEGRAM_CHAT_ID=" .env | cut -d '=' -f2-)
TELEGRAM_BOT_TOKEN=$(grep "^NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=" .env | cut -d '=' -f2-)

if [ -z "$DATA_SERVICE_BASE_URL" ] || [ -z "$TELEGRAM_CHAT_ID" ] || [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "ERRORE: Variabili .env mancanti."
  exit 1
fi

echo "==== DEPLOY FRONTEND INIZIATO ====" | tee $LOGFILE
echo "Data: $(date)" | tee -a $LOGFILE


########################################
# VERSIONAMENTO
########################################
if [ ! -f "$VERSION_FILE" ]; then
  echo "1.0.0" > $VERSION_FILE
fi

VERSION=$(cat $VERSION_FILE)
IFS='.' read MAJOR MINOR PATCH <<< "$VERSION"

COMMITS=$(git log -n 20 --pretty=format:"%s")

if echo "$COMMITS" | grep -qi "BREAKING:" ; then
  MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0
elif echo "$COMMITS" | grep -qi "feat:" ; then
  MINOR=$((MINOR + 1)); PATCH=0
else
  PATCH=$((PATCH + 1))
fi

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo $NEW_VERSION > $VERSION_FILE
TAG="v$NEW_VERSION"

echo "Nuova versione: $TAG" | tee -a $LOGFILE

IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/$REPO/$SERVICE:$TAG"


########################################
# DOCKER BUILD
########################################
echo "Build Docker..." | tee -a $LOGFILE

docker build --platform linux/amd64 -t $IMAGE . 2>&1 | tee -a $LOGFILE

if [ $? -ne 0 ]; then
  MSG="ERRORE: build Docker fallita ($TAG)"
  echo $MSG | tee -a $LOGFILE
  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" -d text="$MSG"
  exit 1
fi


########################################
# DOCKER PUSH
########################################
echo "Push immagine..." | tee -a $LOGFILE

docker push $IMAGE 2>&1 \
  | grep -v "Waiting" \
  | grep -v "Preparing" \
  | grep -v "Layer" \
  | tee -a $LOGFILE

if [ $? -ne 0 ]; then
  MSG="ERRORE: push immagine fallito ($TAG)"
  echo $MSG | tee -a $LOGFILE
  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" -d text="$MSG"
  exit 1
fi


########################################
# REVISIONE CORRENTE
########################################
OLD_REVISION=$(gcloud run services describe $SERVICE \
  --region $REGION --format='value(status.latestReadyRevisionName)' 2>/dev/null)

echo "Old revision: $OLD_REVISION" | tee -a $LOGFILE


########################################
# DEPLOY CLOUD RUN
########################################
echo "Deploy Cloud Run..." | tee -a $LOGFILE

gcloud run deploy $SERVICE \
  --image $IMAGE \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 2>&1 | tee -a $LOGFILE

if [ $? -ne 0 ]; then
  MSG="ERRORE: deploy fallito ($TAG). Rollback in corso..."
  echo $MSG | tee -a $LOGFILE

  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" -d text="$MSG"

  if [ -n "$OLD_REVISION" ]; then
    gcloud run services update-traffic $SERVICE \
      --to-revisions="$OLD_REVISION"=100 --region $REGION
  fi

  exit 1
fi


########################################
# HEALTH CHECK
########################################
URL=$(gcloud run services describe $SERVICE --region $REGION --format='value(status.url)')
echo "Health check..." | tee -a $LOGFILE

sleep 3
curl -f "$URL/api/health" 2>&1 | tee -a $LOGFILE

if [ $? -ne 0 ]; then
  MSG="ERRORE: health check fallito. Rollback."
  echo $MSG | tee -a $LOGFILE

  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" -d text="$MSG"

  if [ -n "$OLD_REVISION" ]; then
    gcloud run services update-traffic $SERVICE \
      --to-revisions="$OLD_REVISION"=100 --region $REGION
  fi

  exit 1
fi


########################################
# SUCCESSO
########################################
MSG="Frontend deploy completato: $SERVICE ($TAG)"
echo $MSG | tee -a $LOGFILE

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" -d text="$MSG"

curl -s -F document=@$LOGFILE \
  "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendDocument" \
  -F chat_id="$TELEGRAM_CHAT_ID" \
  -F caption="Log deploy frontend $TAG"

echo "Fine deploy frontend $TAG" | tee -a $LOGFILE
