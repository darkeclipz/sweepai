
from typing import Any

"""
    Root
        Node
            Variable1
            Variable2
            Node
                Variable3
                Variable4
            Node
                Variable5
                Variable6
"""

class Node():
    def __init__(self, name):
        self.name = name
        self.children = []

    def add_node(self, name):
        node = Node(name)
        self.children.append(node)
        return node


class VariableNode(Node):
    def __init__(self, name, variable):
        self.name = name
        self.variable = variable
    
    def add_node(self, name):
        raise Exception("Variable node can't have children.")

class RootNode(Node):
    pass


class Domain():
    values = []

class BooleanDomain(Domain):
    # Domain of [0, 1]
    def __init__(self):
        self.values = [0, 1]

class IntegerDomain(Domain):
    # Domain of [a, b]
    def __init__(self, a, b):
        self.values = list(range(a, b))

class StringDomain(Domain):
    # Domain of [str1, str2, ...]
    def __init__(self, *values):
        self.values = list(values)


class Variable():
    name: str
    domain: Domain
    value: Any

    def __init__(self, name, domain: Domain):
        self.name = name
        self.domain = domain
        self.value = None

    def __repr__(self):
        return "{}={} ({})".format(self.name, self.value, ", ".join(self.domain.values))


Variables = list[Variable]


class Model():
    variables: Variables = []

    def add_variable(self, variable: Variable):
        self.variables.append(variable)

    def set_value(self, variable: Variable, value):
        if variable.value:
            variable.domain.values.append(variable.value)
        variable.value = value
        variable.domain.values.remove(value)

    def set_requirement(self, variable, value):
        pass

    def solve_default_solution(self):
        for variable in self.variables:
            if not variable.value:
                value = variable.domain.values[0]
                self.set_value(variable, value)
                    



model = Model()
model.add_variable(Variable("A", StringDomain("A1", "A2", "A3")))
model.add_variable(Variable("B", StringDomain("B1", "B2", "B3")))
model.add_variable(Variable("C", StringDomain("C1", "C2", "C3")))
model.solve_default_solution()

model
