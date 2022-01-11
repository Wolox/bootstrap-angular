import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { dependencies, devDependencies, removeDependencies } from './constants';

export function updatePackageJson(name: string): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const path = `/${name}/package.json`;
    if (tree.exists(path)) {
      const file = tree.read(path);
      const json = JSON.parse(file!.toString());

      // Update scripts
      json.scripts = {
        ...json.scripts,
        test: 'jest',
      };

      // Add new dependencies
      json.dependencies = { ...json.dependencies, ...dependencies };
      json.devDependencies = { ...json.devDependencies, ...devDependencies };

      // Remove dependencies
      removeDependencies.forEach(
        (dependency: string) => delete json.devDependencies[dependency]
      );

      tree.overwrite(path, JSON.stringify(json, null, 2));
      return tree;
    }
    throw new SchematicsException(`Does not exist ${path}.`);
  };
}
