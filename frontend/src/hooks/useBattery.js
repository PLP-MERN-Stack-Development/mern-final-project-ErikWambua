import { useState, useEffect } from 'react';

export const useBattery = () => {
  const [batteryState, setBatteryState] = useState({
    charging: false,
    chargingTime: 0,
    dischargingTime: Infinity,
    level: 1,
    supported: false
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.getBattery) {
      return;
    }

    let battery = null;

    const updateBatteryState = (batteryManager) => {
      setBatteryState({
        charging: batteryManager.charging,
        chargingTime: batteryManager.chargingTime,
        dischargingTime: batteryManager.dischargingTime,
        level: batteryManager.level,
        supported: true
      });
    };

    const handleChargingChange = () => {
      if (battery) updateBatteryState(battery);
    };

    const handleLevelChange = () => {
      if (battery) updateBatteryState(battery);
    };

    navigator.getBattery().then((batteryManager) => {
      battery = batteryManager;
      updateBatteryState(batteryManager);

      battery.addEventListener('chargingchange', handleChargingChange);
      battery.addEventListener('levelchange', handleLevelChange);
      battery.addEventListener('chargingtimechange', handleChargingChange);
      battery.addEventListener('dischargingtimechange', handleChargingChange);
    });

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', handleChargingChange);
        battery.removeEventListener('levelchange', handleLevelChange);
        battery.removeEventListener('chargingtimechange', handleChargingChange);
        battery.removeEventListener('dischargingtimechange', handleChargingChange);
      }
    };
  }, []);

  return batteryState;
};

export default useBattery;
