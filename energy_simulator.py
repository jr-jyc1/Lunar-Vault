import numpy as np
import random
from datetime import datetime, timedelta
import math
import json

class EnergySimulator:
    def __init__(self):
        self.base_solar = 5.0  # Base solar production in kW
        self.base_consumption = 3.0  # Base home consumption in kW
        self.battery_capacity = 10.0  # kWh
        self.current_battery = 5.0  # Current battery level in kWh
        
    def get_current_data(self):
        """Generate realistic current energy data"""
        now = datetime.now()
        hour = now.hour
        
        # Solar production based on time of day (bell curve)
        solar_factor = max(0, math.sin((hour - 6) * math.pi / 12)) if 6 <= hour <= 18 else 0
        solar_noise = random.uniform(0.8, 1.2)
        solar_production = self.base_solar * solar_factor * solar_noise
        
        # Home consumption with daily pattern
        consumption_factor = 1.0
        if 6 <= hour <= 9 or 17 <= hour <= 22:  # Peak hours
            consumption_factor = 1.4
        elif 10 <= hour <= 16:  # Day hours
            consumption_factor = 0.8
        else:  # Night hours
            consumption_factor = 0.6
            
        consumption_noise = random.uniform(0.9, 1.1)
        home_consumption = self.base_consumption * consumption_factor * consumption_noise
        
        # Calculate grid interaction and battery
        net_production = solar_production - home_consumption
        
        grid_import = 0.0
        grid_export = 0.0
        battery_charge_rate = 0.0
        
        if net_production > 0:
            # Excess production - charge battery or export to grid
            if self.current_battery < self.battery_capacity:
                charge_amount = min(net_production, self.battery_capacity - self.current_battery)
                battery_charge_rate = charge_amount
                self.current_battery += charge_amount  # Simulate charging
                net_production -= charge_amount
            
            if net_production > 0:
                grid_export = net_production
        else:
            # Deficit - use battery or import from grid
            deficit = abs(net_production)
            if self.current_battery > 0:
                discharge_amount = min(deficit, self.current_battery)
                battery_charge_rate = -discharge_amount
                self.current_battery -= discharge_amount  # Simulate discharging
                deficit -= discharge_amount
            
            if deficit > 0:
                grid_import = deficit
        
        # Keep battery within bounds
        self.current_battery = max(0, min(self.battery_capacity, self.current_battery))
        battery_percentage = (self.current_battery / self.battery_capacity) * 100
        
        return {
            'timestamp': now.isoformat(),
            'solar_production': round(solar_production, 2),
            'home_consumption': round(home_consumption, 2),
            'grid_import': round(grid_import, 2),
            'grid_export': round(grid_export, 2),
            'battery_level': round(battery_percentage, 1),
            'battery_charge_rate': round(battery_charge_rate, 2),
            'net_savings': round(grid_export * 0.08 - grid_import * 0.12, 2)  # Mock pricing
        }
    
    def get_historical_data(self, period):
        """Generate historical data for charts"""
        data_points = []
        
        if period == 'day':
            hours = 24
            interval = timedelta(hours=1)
        elif period == 'week':
            hours = 24 * 7
            interval = timedelta(hours=1)
        elif period == 'month':
            hours = 24 * 30
            interval = timedelta(hours=1)
        else:  # year
            hours = 24 * 365
            interval = timedelta(days=1)
        
        start_time = datetime.now() - timedelta(hours=hours)
        
        for i in range(hours if period != 'year' else 365):
            timestamp = start_time + (interval * i)
            hour = timestamp.hour
            
            # Generate realistic historical data
            solar_factor = max(0, math.sin((hour - 6) * math.pi / 12)) if 6 <= hour <= 18 else 0
            solar_production = self.base_solar * solar_factor * random.uniform(0.7, 1.3)
            
            consumption_factor = 1.0
            if 6 <= hour <= 9 or 17 <= hour <= 22:
                consumption_factor = 1.4
            elif 10 <= hour <= 16:
                consumption_factor = 0.8
            else:
                consumption_factor = 0.6
            
            home_consumption = self.base_consumption * consumption_factor * random.uniform(0.8, 1.2)
            
            data_points.append({
                'timestamp': timestamp.isoformat(),
                'solar_production': round(solar_production, 2),
                'home_consumption': round(home_consumption, 2),
                'grid_import': round(max(0, home_consumption - solar_production), 2),
                'grid_export': round(max(0, solar_production - home_consumption), 2)
            })
        
        return data_points
    
    def get_weather_forecast(self):
        """Generate weather forecast for next 24 hours"""
        forecast = []
        weather_conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy']
        
        for hour in range(24):
            condition = random.choice(weather_conditions)
            forecast.append({
                'hour': hour,
                'condition': condition,
                'temperature': random.randint(15, 30),
                'solar_potential': 100 if condition == 'sunny' else 70 if condition == 'partly-cloudy' else 30
            })
        
        return forecast
    
    def get_ai_recommendation(self, energy_data):
        """Simulate a call to an AI model to get a recommendation."""

        prompt_template = """
You are an expert AI assistant for solar energy homeowners. Your goal is to optimize energy usage. Based on the following real-time data, provide a user-friendly recommendation and a specific, predefined action command.

Your response MUST be a valid JSON object with two keys:
1.  "recommendation": A friendly string for the user (under 250 characters).
2.  "command": One of the following predefined strings: ['NONE', 'SWITCH_TO_BATTERY', 'STOP_DISCHARGE', 'MAXIMIZE_EXPORT_TO_GRID'].

Data:
{
  "location": {
    "city": "Hyderabad, Sindh"
  },
  "weather_forecast": {
    "current_condition": "Clear Sky",
    "forecast_next_4_hours": "Sunny, High Solar Irradiance"
  },
  "solar_system": {
    "live_power_generation_kw": %(solar_production)s,
    "battery_charge_percent": %(battery_level)s,
    "grid_status": "%(grid_status)s"
  }
}

Analyze the data and return the JSON.
"""

        grid_status = "Exporting to Grid" if energy_data['grid_export'] > 0 else "Importing from Grid"

        prompt = prompt_template % {
            'solar_production': energy_data['solar_production'],
            'battery_level': energy_data['battery_level'],
            'grid_status': grid_status
        }

        # Simulate AI response
        possible_responses = [
            {
              "recommendation": "The sun is shining and you're already exporting to the grid. It's a perfect time to charge your battery to full.",
              "command": "MAXIMIZE_EXPORT_TO_GRID"
            },
            {
              "recommendation": "It's peak time and grid prices are high. Switch to battery power to save money.",
              "command": "SWITCH_TO_BATTERY"
            },
            {
              "recommendation": "Your battery is getting low. Let's stop discharging for now and use the grid.",
              "command": "STOP_DISCHARGE"
            },
            {
              "recommendation": "Everything looks good. No action needed at the moment.",
              "command": "NONE"
            }
        ]
        
        return random.choice(possible_responses)

    def get_smart_recommendations(self):
        """Generate smart energy recommendations by calling the AI simulation"""
        current_data = self.get_current_data()
        ai_response = self.get_ai_recommendation(current_data)

        # The new format is a single JSON object, so we wrap it in a list
        # to maintain compatibility with the original structure if needed,
        # or we can adapt the frontend to handle a single object.
        # For now, returning a list with one item.
        return [
            {
                'type': 'ai_recommendation',
                'title': 'AI Smart Suggestion',
                'message': ai_response['recommendation'],
                'command': ai_response['command'],
                'priority': 'high',
                'icon': 'robot'
            }
        ]
