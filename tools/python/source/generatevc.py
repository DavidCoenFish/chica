"""
/*******************************************************
* File:		generatevc.py
* Author:	David Coen
* Date:		2016 06 18
*
******************************************************/


example usage: 
C:\\Users\\David\\AppData\\Local\\Programs\\Python\\Python35\\python.exe D:\\fulldepot\\programming\\tools\\python\\_mainline\\python\\source\\generatevc.py D:\\development\\test\\node02 D:\\development\\test\\node02\\vs node02 -i .filters -i .sln -i .vcxproj -i .suo -i .sdf

C:\\Users\\David\\AppData\\Local\\Programs\\Python\\Python35\\python.exe
"""

# ----------------------------------------------------------------------------------------------------
# import
# ----------------------------------------------------------------------------------------------------
import os
import sys
import optparse
import collections
import xml.etree.cElementTree
import uuid

# ----------------------------------------------------------------------------------------------------
# private methods
# ----------------------------------------------------------------------------------------------------
def MakeDestDir(in_destDir):
	if not os.path.exists(in_destDir):
		os.makedirs(in_destDir)

def TestIgnoreFile(in_name, in_arrayIgnoreExtentions):
	(root, ext) = os.path.splitext(in_name)
	if "" == ext:
		ext = root
	if ext in in_arrayIgnoreExtentions:
		return True
	return False

def GatherFiltersFiles(out_dictFiltersFiles, in_sourceDir, in_arrayIgnoreExtentions):
	(stem, leaf) = os.path.split(in_sourceDir)
	for root, dirs, files in os.walk(in_sourceDir):
		for name in files:
			if True == TestIgnoreFile(name, in_arrayIgnoreExtentions):
				continue
			relPath = os.path.relpath(root, in_sourceDir)
			relFile = os.path.join(relPath, name)

			relStemPath = os.path.relpath(root, stem)
			doctoredPath = os.path.join("source", relStemPath)
			if "." == relStemPath:
				doctoredPath = "source"
			out_dictFiltersFiles[doctoredPath].append(relFile)

def Indent(elem, level=0):
	i = "\n" + level * "\t"
	if len(elem):
		if not elem.text or not elem.text.strip():
			elem.text = i + "\t"
		if not elem.tail or not elem.tail.strip():
			elem.tail = i
		for elem in elem:
			Indent(elem, level+1)
		if not elem.tail or not elem.tail.strip():
			elem.tail = i
	else:
		if level and (not elem.tail or not elem.tail.strip()):
			elem.tail = i

def SaveVCSolution(in_destDir, in_destProjectName, in_guid, in_arrayConfiguration):
	saveFile = os.path.join(in_destDir, in_destProjectName + ".sln")
	text_file = open(saveFile, "w")
	text_file.write("Microsoft Visual Studio Solution File, Format Version 12.00\n")
	text_file.write("# Visual Studio 15\n")
	text_file.write("VisualStudioVersion = 15.0.26228.4\n")
	text_file.write("MinimumVisualStudioVersion = 10.0.40219.1\n")
	text_file.write("Project(\"{%s}\") = \"%s\", \"%s\", \"{%s}\"\n" % (str(uuid.uuid4()), in_destProjectName, in_destProjectName + ".vcxproj", in_guid))
	text_file.write("EndProject\n")
	text_file.write("Global\n")
	text_file.write("	GlobalSection(SolutionConfigurationPlatforms) = preSolution\n")
	for item in in_arrayConfiguration:
		text_file.write("		%s|x64 = %s|x64\n" % (item, item))
	text_file.write("	EndGlobalSection\n")
	text_file.write("	GlobalSection(ProjectConfigurationPlatforms) = postSolution\n")
	for item in in_arrayConfiguration:
		text_file.write("		{%s}.Main|x64.ActiveCfg = %s|x64\n" % (in_guid, item))
		text_file.write("		{%s}.Main|x64.Build.0 = %s|x64\n" % (in_guid, item))
	text_file.write("	EndGlobalSection\n")
	text_file.write("	GlobalSection(SolutionProperties) = preSolution\n")
	text_file.write("		HideSolutionNode = FALSE\n")
	text_file.write("	EndGlobalSection\n")
	text_file.write("EndGlobal\n")
	text_file.close()

def SaveVCProject(in_destDir, in_destProjectName, in_dictFiltersFiles, in_guid, in_arrayConfiguration):
	root = xml.etree.cElementTree.Element("Project", {"DefaultTargets" : "Build", "ToolsVersion" : "15.0", "xmlns" : "http://schemas.microsoft.com/developer/msbuild/2003"})

	itemGroupProjectConfigurations = xml.etree.cElementTree.SubElement(root, "ItemGroup", {"Label" : "ProjectConfigurations"})

	for item in in_arrayConfiguration:
		projectConfigurationMain = xml.etree.cElementTree.SubElement(itemGroupProjectConfigurations, "ProjectConfiguration", {"Include" : item + "|x64"})
		xml.etree.cElementTree.SubElement(projectConfigurationMain, "Configuration").text = item
		xml.etree.cElementTree.SubElement(projectConfigurationMain, "Platform").text = "x64"

	propertyGroupGlobals = xml.etree.cElementTree.SubElement(root, "PropertyGroup", {"Label" : "Globals"})
	xml.etree.cElementTree.SubElement(propertyGroupGlobals, "VCProjectVersion").text = "15.0"
	xml.etree.cElementTree.SubElement(propertyGroupGlobals, "ProjectGuid").text = "{" + in_guid + "}"
	xml.etree.cElementTree.SubElement(propertyGroupGlobals, "Keyword").text = "MakeFileProj"

	xml.etree.cElementTree.SubElement(root, "Import", {"Project" : "$(VCTargetsPath)\Microsoft.Cpp.Default.props"})

	for item in in_arrayConfiguration:
		propertyGroup = xml.etree.cElementTree.SubElement(root, "PropertyGroup", {"Label" : "Configuration", "Condition" : "'$(Configuration)|$(Platform)'=='%s|x64'" % item})
		xml.etree.cElementTree.SubElement(propertyGroup, "ConfigurationType").text = "Makefile";
		xml.etree.cElementTree.SubElement(propertyGroup, "UseDebugLibraries").text = "true";
		xml.etree.cElementTree.SubElement(propertyGroup, "PlatformToolset").text = "v141";

	xml.etree.cElementTree.SubElement(root, "Import", {"Project" : "$(VCTargetsPath)\Microsoft.Cpp.props"})

	xml.etree.cElementTree.SubElement(root, "ImportGroup", {"Label" : "ExtensionSettings"})
	xml.etree.cElementTree.SubElement(root, "ImportGroup", {"Label" : "Shared"})

	xml.etree.cElementTree.SubElement(root, "PropertyGroup", {"Label" : "UserMacros"})

	for item in in_arrayConfiguration:
		propertyGroup = xml.etree.cElementTree.SubElement(root, "PropertyGroup", {"Condition" : "'$(Configuration)|$(Platform)'=='%s|x64'" % item})
		xml.etree.cElementTree.SubElement(propertyGroup, "NMakeBuildCommandLine").text = "cd.. & %s.bat" % item.lower();
		xml.etree.cElementTree.SubElement(propertyGroup, "NMakeOutput").text = "";
		xml.etree.cElementTree.SubElement(propertyGroup, "NMakePreprocessorDefinitions").text = "$(NMakePreprocessorDefinitions)";

	xml.etree.cElementTree.SubElement(root, "ItemDefinitionGroup").text = "";
	xml.etree.cElementTree.SubElement(root, "ImportGroup", {"Label" : "ExtensionSettings"})
	xml.etree.cElementTree.SubElement(root, "ImportGroup", {"Label" : "Shared"})

	for item in in_arrayConfiguration:
		importGroup = xml.etree.cElementTree.SubElement(root, "ImportGroup", {"Condition" : "'$(Configuration)|$(Platform)'=='%s|x64'" % item})
		xml.etree.cElementTree.SubElement(importGroup, "Import", {"Project" : "$(UserRootDir)\Microsoft.Cpp.$(Platform).user.props", "Condition" : "exists('$(UserRootDir)\Microsoft.Cpp.$(Platform).user.props')", "Label" : "LocalAppDataPlatform"})

	itemGroup = xml.etree.cElementTree.SubElement(root, "ItemGroup")
	for key in in_dictFiltersFiles:
		listFile = in_dictFiltersFiles[key]
		for file in listFile:
			xml.etree.cElementTree.SubElement(itemGroup, "None", {"Include" : "..\\" + file})

	xml.etree.cElementTree.SubElement(root, "Import", {"Project" : "$(VCTargetsPath)\Microsoft.Cpp.targets"});
	xml.etree.cElementTree.SubElement(root, "ImportGroup", {"Label" : "ExtensionTargets"});

	Indent(root)

	tree = xml.etree.cElementTree.ElementTree(root)
	saveFile = os.path.join(in_destDir, in_destProjectName + ".vcxproj")
	tree.write(saveFile, xml_declaration=True, encoding='utf-8')

def ProjectFilterAddFilter(inout_setCreated, inout_itemGroup, in_key):
	if in_key in inout_setCreated:
		return
	(stem, leaf) = os.path.split(in_key)
	if "" != stem:
		ProjectFilterAddFilter(inout_setCreated, inout_itemGroup, stem)
	inout_setCreated.add(in_key)
	filter = xml.etree.cElementTree.SubElement(inout_itemGroup, "Filter", {"Include" : in_key})
	xml.etree.cElementTree.SubElement(filter, "UniqueIdentifier").text = "{" + str(uuid.uuid4()) + "}"

def SaveVCProjectFilter(in_destDir, in_destProjectName, in_dictFiltersFiles):
	root = xml.etree.cElementTree.Element("Project", {"ToolsVersion" : "4.0", "xmlns" : "http://schemas.microsoft.com/developer/msbuild/2003"})
	itemGroup = xml.etree.cElementTree.SubElement(root, "ItemGroup")

	createFilters = set()
	ProjectFilterAddFilter(createFilters, itemGroup, "source")
	for key in in_dictFiltersFiles:
		ProjectFilterAddFilter(createFilters, itemGroup, key)

	itemGroup2 = xml.etree.cElementTree.SubElement(root, "ItemGroup")
	for key in in_dictFiltersFiles:
		listFile = in_dictFiltersFiles[key]
		for file in listFile:
			none = xml.etree.cElementTree.SubElement(itemGroup2, "None", {"Include" : "..\\" + file})
			xml.etree.cElementTree.SubElement(none, "Filter").text = key

	Indent(root)
	tree = xml.etree.cElementTree.ElementTree(root)
	saveFile = os.path.join(in_destDir, in_destProjectName + ".vcxproj.filters")
	tree.write(saveFile, xml_declaration=True, encoding='utf-8')

def GenerateVC(in_sourceDir, in_destDir, in_destProjectName, in_arrayIgnoreExtentions, in_arrayConfiguration):
	print("GenerateVC", in_sourceDir, in_destDir, in_destProjectName, in_arrayIgnoreExtentions, in_arrayConfiguration)

	dictFiltersFiles = collections.defaultdict(list)

	GatherFiltersFiles(dictFiltersFiles, in_sourceDir, in_arrayIgnoreExtentions)
	guid = str(uuid.uuid4())

	MakeDestDir(in_destDir)
	SaveVCSolution(in_destDir, in_destProjectName, guid, in_arrayConfiguration)
	SaveVCProject(in_destDir, in_destProjectName, dictFiltersFiles, guid, in_arrayConfiguration)
	SaveVCProjectFilter(in_destDir, in_destProjectName, dictFiltersFiles)


# ----------------------------------------------------------------------------------------------------
# application inpoint
# ----------------------------------------------------------------------------------------------------
if __name__ == '__main__':
	parser = optparse.OptionParser(
		usage = "usage: %prog sourceDir destDir destProjectName [-i ext]",
		description = ""
		)

	parser.add_option(
		"-i", 
		"--ignore",
		default = [],
		type = str,
		action = "append", 
		dest = "ignore", 
		help = "An etention without leading dot to ignore and not add the the project filter. Can be repeated"
		)

	parser.add_option(
		"-c", 
		"--configuration",
		default = [],
		type = str,
		action = "append", 
		dest = "configuration", 
		help = "the set of configurations for the project, such as -c Debug -c Release"
		)

	(options, args) = parser.parse_args()
	if len(args) != 3:
		parser.error("incorrect number of arguments")
	else:
		GenerateVC(args[0], args[1], args[2], options.ignore, options.configuration)

