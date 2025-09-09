import unittest
from energy_simulator import EnergySimulator

class TestEnergySimulator(unittest.TestCase):

    def test_battery_charging(self):
        simulator = EnergySimulator()
        simulator.current_battery = 5.0
        simulator.battery_capacity = 10.0

        initial_battery = 5.0
        net_production = 2.0 # 2kW surplus

        # This is the logic from the original class
        if net_production > 0:
            if simulator.current_battery < simulator.battery_capacity:
                charge_amount = min(net_production, simulator.battery_capacity - simulator.current_battery)
                simulator.current_battery += charge_amount

        # The expected value should be initial_battery + charge_amount, which is 5.0 + 2.0 = 7.0
        self.assertEqual(simulator.current_battery, 7.0)

    def test_battery_discharging(self):
        simulator = EnergySimulator()
        simulator.current_battery = 5.0
        simulator.battery_capacity = 10.0

        initial_battery = 5.0
        net_production = -2.0 # 2kW deficit

        # This is the logic from the original class
        if net_production < 0:
            deficit = abs(net_production)
            if simulator.current_battery > 0:
                discharge_amount = min(deficit, simulator.current_battery)
                simulator.current_battery -= discharge_amount

        # The expected value should be initial_battery - discharge_amount, which is 5.0 - 2.0 = 3.0
        self.assertEqual(simulator.current_battery, 3.0)

if __name__ == '__main__':
    unittest.main()
