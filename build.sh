#!/bin/bash

# BaTukang EAS Build Script
# Usage: ./build.sh [platform] [profile]
# Example: ./build.sh android preview

# Set PATH to include Homebrew
export PATH="/opt/homebrew/bin:$PATH"

# Default values
PLATFORM=${1:-android}
PROFILE=${2:-preview}

echo "🚀 Starting EAS build for BaTukang"
echo "Platform: $PLATFORM"
echo "Profile: $PROFILE"
echo ""

# Check if EAS CLI is available
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/cli eas-cli
fi

# Check if logged in
echo "👤 Checking Expo authentication..."
eas whoami

echo ""
echo "🔨 Starting build..."
echo "This will open an interactive prompt for keystore generation if needed."
echo ""

# Start the build
eas build --platform $PLATFORM --profile $PROFILE

echo ""
echo "✅ Build command completed!"
echo "Check the Expo dashboard for build status: https://expo.dev/accounts/ifailamir/projects/batukang"
